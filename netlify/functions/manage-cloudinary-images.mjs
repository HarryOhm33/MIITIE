import { v2 as cloudinary } from "cloudinary";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const allowedCollections = new Set(["events", "mentors"]);
let googleJwks;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase Admin environment variables are not configured");
  }

  return initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

async function verifyFirebaseToken(token, projectId) {
  const { jwtVerify, createRemoteJWKSet } = await import("jose");
  if (!googleJwks) {
    googleJwks = createRemoteJWKSet(
      new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
    );
  }

  const { payload } = await jwtVerify(token, googleJwks, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  return payload.sub;
}

async function requireAdmin(request, app) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("Authentication is required");

  let uid;
  try {
    uid = await verifyFirebaseToken(token, process.env.FIREBASE_PROJECT_ID);
  } catch (err) {
    console.error("Token verification failed:", err);
    throw new Error("Authentication is required");
  }

  const user = await getFirestore(app).collection("users").doc(uid).get();
  const data = user.data();
  if (!user.exists || (data?.isAdmin !== true && data?.isSuperAdmin !== true)) {
    throw new Error("Admin access is required");
  }
}

async function destroyImage(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const app = getAdminApp();
    await requireAdmin(request, app);

    const { action, collection, documentId } = await request.json();
    if (!allowedCollections.has(collection) || !documentId) {
      return json({ error: "Invalid collection or document ID" }, 400);
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary environment variables are not configured");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const db = getFirestore(app);
    const documentRef = db.collection(collection).doc(documentId);
    const snapshot = await documentRef.get();
    if (!snapshot.exists) return json({ error: "Document not found" }, 404);

    const data = snapshot.data();

    if (action === "delete-replaced-image") {
      const oldPublicId = data.previousImagePublicId;
      if (!oldPublicId) return json({ deleted: false });
      if (oldPublicId === data.imagePublicId) {
        return json({ error: "Refusing to delete the current image" }, 409);
      }

      await destroyImage(oldPublicId);
      await documentRef.update({ previousImagePublicId: FieldValue.delete() });
      return json({ deleted: true });
    }

    if (action === "delete-document") {
      const imagePublicIds = new Set(
        [data.imagePublicId, data.previousImagePublicId].filter(Boolean),
      );
      await Promise.all([...imagePublicIds].map(destroyImage));
      await documentRef.delete();
      return json({ deleted: true });
    }

    return json({ error: "Invalid action" }, 400);
  } catch (error) {
    console.error("Cloudinary image management failed", error);
    const status = /Authentication|Admin access/.test(error.message) ? 403 : 500;
    return json({ error: error.message || "Image management failed" }, status);
  }
};

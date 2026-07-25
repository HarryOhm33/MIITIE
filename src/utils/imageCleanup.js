import { auth } from "../../firebase";

const endpoint = "/.netlify/functions/manage-cloudinary-images";

async function callImageFunction(payload) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in");

  const token = await user.getIdToken();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Image cleanup failed");
  return result;
}

export const deleteReplacedImage = (collection, documentId) =>
  callImageFunction({ action: "delete-replaced-image", collection, documentId });

export const deleteDocumentWithImage = (collection, documentId) =>
  callImageFunction({ action: "delete-document", collection, documentId });

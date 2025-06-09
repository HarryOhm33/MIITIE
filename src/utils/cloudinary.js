import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);
  formData.append("api_key", API_KEY);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
    };
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error.response?.data || error.message
    );
    throw new Error("Image upload failed");
  }
};

export const deleteImage = async (publicId) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        public_id: publicId,
        api_key: API_KEY,
        timestamp: timestamp,
        signature: signature,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
};

// Note: In production, this should be done on the backend
const generateSignature = async (publicId, timestamp) => {
  // This is a simplified frontend-only approach - NOT SECURE FOR PRODUCTION
  const secret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${secret}`;
  return hashString(signatureString);
};

const hashString = async (str) => {
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

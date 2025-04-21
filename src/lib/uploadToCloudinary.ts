// src/lib/uploadToCloudinary.ts

export async function uploadToCloudinary(file: File): Promise<string | null> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary environment variables are missing!");
      return null;
    }
  
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
  
    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        return data.secure_url; // This is the URL of the uploaded file
      } else {
        console.error("Upload failed:", data);
        return null;
      }
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  }
  
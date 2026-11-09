export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "amazon_blogs"
  );

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return { url: data.secure_url, path: data.public_id };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch("/api/delete-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return null;
  }
};


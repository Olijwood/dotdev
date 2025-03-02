"use server";

import fs from "fs";
import path from "path";

export async function uploadImage(formData: FormData) {
    "use server";
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;
    const postId = formData.get("postId") as string | null;

    if (!file || !userId) {
        return { error: "Invalid upload request." };
    }
    try {
        const baseDir = path.join(process.cwd(), "uploads", userId);
        const uploadDir = postId ? path.join(baseDir, postId) : baseDir;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(file.name);
        const uniqueId = crypto.randomUUID();
        const fileName = `${uniqueId}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        // Save File to Server
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, fileBuffer);

        const fileUrl = postId
            ? `/uploads/${userId}/${postId}/${fileName}`
            : `/uploads/${userId}/${fileName}`;

        return { imageUrl: fileUrl };
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: "Upload failed. Please try again." };
    }
}

export async function deleteImage(imageUrl: string) {
    "use server";

    if (!imageUrl) return { error: "No image path provided." };

    try {
        const filePath = path.join(process.cwd(), "uploads", imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file
            return { success: "Image deleted successfully." };
        } else {
            return { error: "File not found." };
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        return { error: "Failed to delete image. Please try again." };
    }
}

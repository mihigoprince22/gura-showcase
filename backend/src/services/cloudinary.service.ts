import { config } from '../config/env.js';

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
}

export async function uploadImage(
  base64Image: string,
  folder = 'gura_listings'
): Promise<string> {
  // Mocking Cloudinary upload to avoid needing real keys.
  // Delay for simulation
  await new Promise((resolve) => setTimeout(resolve, 500));

  /*
  // Real implementation payload (commented out as requested):
  if (config.CLOUDINARY_URL) {
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', 'gura_preset');
    formData.append('folder', folder);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  }
  */

  // Return a mocked URL
  const randomId = Math.random().toString(36).substring(2, 8);
  return `https://res.cloudinary.com/demo/image/upload/v1700000000/${folder}/mock_${randomId}.jpg`;
}

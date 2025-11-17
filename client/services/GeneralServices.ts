import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseconfig';

// Accepts: array of file URIs (strings)
export async function UploadFiles(
  files: string[]
): Promise<{ status: 'success' | 'error'; data: { url: string; type: string }[] }> {
  try {
    const uploads: { url: string; type: string }[] = [];

    for (const file of files) {
      const response = await fetch(file);
      const blob = await response.blob();

      // Detect type (image/* or video/*)
      const mimeType = blob.type;
      const isImage = mimeType.startsWith('image/');
      const isVideo = mimeType.startsWith('video/');
      const fileType = isImage ? 'image' : isVideo ? 'video' : 'unknown';

      // Firebase path uses prefix
      const fileRef = ref(storage, `uploads/${Date.now()}-${Math.random()}-${fileType}`);

      const uploaded = await uploadBytes(fileRef, blob);
      const url = await getDownloadURL(uploaded.ref);

      uploads.push({ url, type: fileType });
    }

    return { status: 'success', data: uploads };
  } catch (error) {
    console.log('UPLOAD ERROR:', error);
    return { status: 'error', data: [] };
  }
}

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseconfig';

export async function UploadImage(
  image: string | null
): Promise<{ status: 'success' | 'error'; data: string }> {
  if (!image) {
    return { status: 'error', data: '' };
  }

  const response = await fetch(image); // Fetch the file from the local URI
  const blob = await response.blob(); // Convert it into a Blob

  const ImageRef = ref(storage, `files/${Date.now()}-image`);

  try {
    const upload = await uploadBytes(ImageRef, blob);
    const url = await getDownloadURL(upload.ref);
    return { status: 'success', data: url };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return { status: 'error', data: '' };
  }
}

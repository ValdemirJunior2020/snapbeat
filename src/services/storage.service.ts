// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\storage.service.ts
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadableAsset {
  uri: string;
  fileName?: string;
}

const guessContentType = (fileName: string): string => {
  const lower = fileName.toLowerCase();

  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.mp3')) return 'audio/mpeg';
  if (lower.endsWith('.m4a')) return 'audio/mp4';
  if (lower.endsWith('.wav')) return 'audio/wav';
  if (lower.endsWith('.mp4')) return 'video/mp4';

  return 'application/octet-stream';
};

const uriToBlob = (uri: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error('Could not convert local file to blob.'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

export async function uploadSingleAsset(
  userId: string,
  asset: UploadableAsset,
  folder: 'audio' | 'watermarks'
): Promise<string> {
  const fileName =
    asset.fileName?.trim() ||
    (folder === 'audio' ? 'audio-file.m4a' : 'watermark.png');

  const blob = await uriToBlob(asset.uri);
  const storageRef = ref(storage, `users/${userId}/${folder}/${Date.now()}-${fileName}`);

  await uploadBytes(storageRef, blob, {
    contentType: guessContentType(fileName),
  });

  return await getDownloadURL(storageRef);
}

export async function uploadManyAssets(
  userId: string,
  assets: UploadableAsset[],
  folder: 'photos'
): Promise<string[]> {
  const uploads = assets.map(async (asset, index) => {
    const fileName = asset.fileName?.trim() || `photo-${index + 1}.jpg`;
    const blob = await uriToBlob(asset.uri);
    const storageRef = ref(
      storage,
      `users/${userId}/${folder}/${Date.now()}-${index + 1}-${fileName}`
    );

    await uploadBytes(storageRef, blob, {
      contentType: guessContentType(fileName),
    });

    return await getDownloadURL(storageRef);
  });

  return await Promise.all(uploads);
}

export const storageService = {
  uploadSingleAsset,
  uploadManyAssets,
};
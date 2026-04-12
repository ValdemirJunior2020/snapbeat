// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\storage.service.ts

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

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

const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};

export const storageService = {
  async uploadFile(
    uri: string,
    destinationPath: string,
    fileName: string
  ): Promise<string> {
    const blob = await uriToBlob(uri);
    const storageRef = ref(storage, `${destinationPath}/${fileName}`);

    await uploadBytes(storageRef, blob, {
      contentType: guessContentType(fileName),
    });

    return await getDownloadURL(storageRef);
  },

  async uploadProjectPhoto(
    userId: string,
    projectId: string,
    localUri: string,
    index: number
  ): Promise<string> {
    const fileName = `photo-${index + 1}.jpg`;
    return this.uploadFile(localUri, `users/${userId}/projects/${projectId}/photos`, fileName);
  },

  async uploadProjectAudio(
    userId: string,
    projectId: string,
    localUri: string,
    originalFileName: string
  ): Promise<string> {
    return this.uploadFile(
      localUri,
      `users/${userId}/projects/${projectId}/audio`,
      originalFileName
    );
  },

  async uploadWatermark(
    userId: string,
    projectId: string,
    localUri: string
  ): Promise<string> {
    return this.uploadFile(
      localUri,
      `users/${userId}/projects/${projectId}/watermark`,
      'watermark.png'
    );
  },
};
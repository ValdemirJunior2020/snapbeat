// FILE: backend/src/services/storage.service.ts
import admin from 'firebase-admin';
import path from 'node:path';
import fs from 'node:fs/promises';

let initialized = false;

function getServiceAccount() {
  const rawJson = process.env.BACKEND_FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!rawJson) {
    throw new Error('Missing BACKEND_FIREBASE_SERVICE_ACCOUNT_JSON.');
  }

  const parsed = JSON.parse(rawJson);
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }

  return parsed;
}

export function getAdminApp() {
  if (!initialized) {
    admin.initializeApp({
      credential: admin.credential.cert(getServiceAccount()),
      storageBucket: process.env.BACKEND_FIREBASE_STORAGE_BUCKET
    });
    initialized = true;
  }

  return admin.app();
}

export async function downloadRemoteFile(url: string, destinationPath: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download remote file: ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.writeFile(destinationPath, buffer);
}

export async function uploadRenderedVideo(localPath: string, userId: string, projectId: string): Promise<string> {
  const app = getAdminApp();
  const bucket = app.storage().bucket();
  const destination = `renders/${userId}/${projectId}.mp4`;

  await bucket.upload(localPath, {
    destination,
    metadata: {
      contentType: 'video/mp4'
    }
  });

  const file = bucket.file(destination);
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: '2035-01-01'
  });

  return signedUrl;
}

export async function updateProjectAfterRender(projectId: string, data: Record<string, unknown>) {
  const app = getAdminApp();
  await app.firestore().collection('projects').doc(projectId).set(
    {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

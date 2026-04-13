// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\firestore.service.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ProjectRecord {
  id?: string;
  userId: string;
  title?: string;
  style: string;
  format: string;
  bpm: number;
  photos?: string[];
  photoCount?: number;
  audioUrl?: string;
  audioName?: string;
  watermarkUrl?: string;
  videoUrl?: string;
  renderJobId?: string;
  status: 'draft' | 'uploading' | 'pending' | 'processing' | 'complete' | 'error';
  createdAt?: unknown;
  updatedAt?: unknown;
}

const projectsCollection = collection(db, 'projects');

export async function createProject(project: ProjectRecord): Promise<string> {
  const docRef = await addDoc(projectsCollection, {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function createProjectWithId(projectId: string, project: ProjectRecord): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);

  await setDoc(projectRef, {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProject(projectId: string, updates: Partial<ProjectRecord>): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);

  await updateDoc(projectRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function getProject(projectId: string): Promise<ProjectRecord | null> {
  const projectRef = doc(db, 'projects', projectId);
  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as ProjectRecord),
  };
}

export async function getUserProjects(userId: string): Promise<ProjectRecord[]> {
  const q = query(
    projectsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as ProjectRecord),
  }));
}

export async function deleteProject(projectId: string): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);
}

export const firestoreService = {
  createProject,
  createProjectWithId,
  updateProject,
  getProject,
  getUserProjects,
  deleteProject,
};
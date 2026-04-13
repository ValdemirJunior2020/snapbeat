// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\firebase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDoRs0tpKhdvswCN8AmT877LBlyuDaFekE',
  authDomain: 'trend2post-cff33.firebaseapp.com',
  projectId: 'trend2post-cff33',
  storageBucket: 'trend2post-cff33.firebasestorage.app',
  messagingSenderId: '225431785623',
  appId: '1:225431785623:web:ace82cb6175149f45399d2',
  measurementId: 'G-B1XTZPF1MP',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const authInstance = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
})();

export const firebaseApp = app;
export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
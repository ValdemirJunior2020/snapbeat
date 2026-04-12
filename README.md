
# BeatVideo Maker

This repository is the generated Expo + backend starter requested in the uploaded specification. It follows the main architecture from your pasted prompt and is wired for Expo Router, React Native Firebase, RevenueCat, and a Node/FFmpeg render server. The source request is in your uploaded file.

## Important implementation notes

1. **Native builds only**  
   React Native Firebase and RevenueCat use native code, so this project must run in an **EAS development build** or production build. It will not run in Expo Go. Expo Router typed routes still use `experiments.typedRoutes`, and React Native Firebase’s Expo guidance recommends config plugins with development builds. RevenueCat’s Expo docs also require a development build or production binary.

2. **Default music fallback**  
   Your requested folder tree did not include a bundled audio asset directory. To keep the project runnable without inventing extra media files, the “Use default music” option currently uses `EXPO_PUBLIC_DEFAULT_MUSIC_URL` from `.env`. Replace that URL with your own hosted 30-second track, or later add a bundled local asset if you want.

3. **react-native-video choice**  
   The project uses `react-native-video` on the preview screen exactly as requested. The current docs show active installation changes around newer versions, especially on Expo and Nitro-based builds, so treat the package version in `package.json` as the baseline and re-run `npx expo install` if Expo asks for alignment during setup.

---

## Folder tree

```text
BeatVideoMaker/
├── app
│   ├── (app)
│   │   ├── create
│   │   │   ├── _layout.tsx
│   │   │   ├── music.tsx
│   │   │   ├── options.tsx
│   │   │   ├── photos.tsx
│   │   │   └── processing.tsx
│   │   ├── preview
│   │   │   └── [projectId].tsx
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── paywall.tsx
│   │   └── settings.tsx
│   ├── (auth)
│   │   ├── _layout.tsx
│   │   ├── forgot-password.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── _layout.tsx
│   └── onboarding.tsx
├── assets
│   ├── adaptive-icon.png
│   ├── icon.png
│   └── splash.png
├── backend
│   ├── src
│   │   ├── routes
│   │   │   └── render.ts
│   │   ├── services
│   │   │   ├── ffmpeg.service.ts
│   │   │   └── storage.service.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── src
│   ├── components
│   │   ├── create
│   │   │   ├── FormatPicker.tsx
│   │   │   ├── MusicPicker.tsx
│   │   │   ├── PhotoGrid.tsx
│   │   │   └── StyleSelector.tsx
│   │   ├── project
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectList.tsx
│   │   └── ui
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ProgressBar.tsx
│   │       └── Toast.tsx
│   ├── constants
│   │   ├── colors.ts
│   │   ├── config.ts
│   │   └── styles.ts
│   ├── context
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useProjects.ts
│   │   ├── usePurchases.ts
│   │   ├── useRender.ts
│   │   └── useToast.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── firestore.service.ts
│   │   ├── purchases.service.ts
│   │   ├── render.service.ts
│   │   └── storage.service.ts
│   ├── types
│   │   └── index.ts
│   └── utils
│       ├── beat.ts
│       ├── format.ts
│       └── validation.ts
├── .env.example
├── app.config.ts
├── babel.config.js
├── eas.json
├── expo-env.d.ts
├── firestore.rules
├── package.json
├── storage.rules
└── tsconfig.json
```

---

## Mobile install commands

Create the app from this ZIP, then run:

```bash
cd BeatVideoMaker
npm install
npx expo install expo-router react-native-safe-area-context react-native-screens react-native-gesture-handler expo-status-bar expo-image-picker expo-document-picker expo-sharing expo-file-system @react-native-async-storage/async-storage @expo/vector-icons
npx expo install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
npm install react-native-purchases react-native-video react-native-draggable-flatlist babel-plugin-module-resolver patch-package
```

### Prebuild / dev build commands

```bash
npx expo prebuild
eas build --profile development --platform ios
eas build --profile preview --platform ios
eas build --profile production --platform ios
```

### Submit to Apple

```bash
eas submit --profile production --platform ios
```

---

## Backend install commands

```bash
cd backend
npm install
npm run dev
```

### Backend production build

```bash
cd backend
npm run build
npm start
```

---

## RevenueCat + App Store Connect setup

Your spec asks for a **non-consumable** unlock:

- **Product ID:** `com.beatvideomaker.export_unlock`
- **Entitlement ID:** `export_unlock`
- **Type:** Non-consumable
- **Price:** $1.99

### In App Store Connect

1. Open your app.
2. Go to **Monetization > In-App Purchases**.
3. Create a **Non-Consumable** product.
4. Use the exact product ID: `com.beatvideomaker.export_unlock`
5. Add localized name/description and pricing.
6. Make sure the IAP is attached to the app version you submit for review.
7. Add real screenshots from the working paywall screen.
8. Add working Privacy Policy and Terms of Use links in App Store metadata too.

### In RevenueCat

1. Create a new app in RevenueCat.
2. Add your iOS app bundle ID.
3. Add App Store Connect API credentials or shared secret as required by RevenueCat.
4. Create entitlement: `export_unlock`
5. Import or create product: `com.beatvideomaker.export_unlock`
6. Attach that product to the entitlement.
7. Put the product into your default offering.
8. Copy the iOS public SDK key into `EXPO_PUBLIC_RC_IOS_API_KEY`

RevenueCat’s Expo guidance explicitly calls for a development build rather than Expo Go.

---

## Firebase console setup

### 1) Create the Firebase project
Create a Firebase project for the app.

### 2) Register iOS and Android apps
Register:
- iOS bundle ID: `com.beatvideomaker.app`
- Android package: `com.beatvideomaker.app`

Download:
- `GoogleService-Info.plist`
- `google-services.json`

Place them in the root and point `IOS_GOOGLE_SERVICES_FILE` / `ANDROID_GOOGLE_SERVICES_FILE` at them.

### 3) Enable Authentication
Enable:
- Email / Password

### 4) Enable Firestore
Create Firestore in production mode and deploy `firestore.rules`.

### 5) Enable Storage
Create Storage and deploy `storage.rules`.

### 6) Create service account for backend
Generate a Firebase Admin SDK service account and paste the JSON into:
- `BACKEND_FIREBASE_SERVICE_ACCOUNT_JSON`

### 7) Set the backend bucket
Set:
- `BACKEND_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com`

React Native Firebase’s Expo docs recommend config plugins and note that Expo Go cannot run these native modules.

---

## Environment variables

Copy `.env.example` to `.env` and fill in every value.

### Mobile
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_RC_IOS_API_KEY`
- `EXPO_PUBLIC_RC_ANDROID_API_KEY`
- `EXPO_PUBLIC_PRIVACY_URL`
- `EXPO_PUBLIC_TERMS_URL`
- `EXPO_PUBLIC_DEFAULT_MUSIC_URL`

### app.config.ts
- `IOS_GOOGLE_SERVICES_FILE`
- `ANDROID_GOOGLE_SERVICES_FILE`
- `EAS_PROJECT_ID`

### Backend
- `BACKEND_PORT`
- `BACKEND_CORS_ORIGIN`
- `BACKEND_FIREBASE_STORAGE_BUCKET`
- `BACKEND_FIREBASE_SERVICE_ACCOUNT_JSON`
- `FFMPEG_PATH`
- `TMP_DIR`
- `FONT_FILE`

---

## FFmpeg server notes

The backend currently:
- downloads photo/audio/watermark URLs to a temp folder
- generates a Ken Burns style slideshow with `zoompan`
- crossfades slides with `xfade`
- trims and fades out the audio
- overlays optional title text with `drawtext`
- overlays an optional watermark
- uploads the finished MP4 to Firebase Storage
- updates the Firestore `projects` document

This uses an in-memory `Map` for job status, exactly as a small starter backend should. For production scaling, move jobs to Redis/BullMQ or another persistent queue.

---

## iPhone testing checklist

Use this before submission:

1. Install a fresh EAS development build on a physical iPhone.
2. Confirm onboarding only appears on first launch.
3. Sign up with a brand-new email/password account.
4. Log out and log back in to verify persistent auth.
5. Pick 1 photo and verify the create flow advances.
6. Pick 10+ photos and drag reorder them.
7. Pick custom audio and verify the file name displays.
8. Leave BPM blank and confirm the app defaults to 120 with a warning.
9. Add a watermark and optional title.
10. Start a render and verify upload/progress states appear.
11. Confirm the backend receives `/render` and `/render/:jobId` traffic.
12. Open the preview screen and confirm the MP4 plays with controls.
13. Tap **Export / Share** while locked and confirm it routes to paywall.
14. Complete a sandbox purchase and confirm export unlocks.
15. Delete and reinstall the app, then confirm **Restore Purchases** works.
16. Verify Privacy Policy and Terms links open correctly.
17. Test on slow network to confirm error handling is readable.
18. Test Instagram button with Instagram installed and not installed.
19. Delete a project and confirm it disappears from the home list.
20. Run one render with portrait, square, and landscape formats.

---

## App Store review preparation notes

Use this kind of reviewer note in App Store Connect:

> BeatVideo Maker lets users create slideshow videos from photos and music.  
> Sign in with any email/password test account you create in the app.  
> To test the export flow: create a project by selecting photos, optionally pick music, then generate the video.  
> The export unlock is a one-time non-consumable purchase.  
> Privacy Policy and Terms of Use links are available on the paywall and Settings screens.  
> Instagram sharing uses the native share flow and an Instagram deep link when the Instagram app is installed.

Also make sure:
- paywall is responsive
- the IAP is approved or submitted with the app version
- review screenshots show **real working app screens**, not splash-only captures
- the render server is online during review

Expo’s EAS setup and current Expo Router guidance remain the right fit for this architecture.

---

## Final ZIP manifest

The ZIP should contain:

- Expo mobile app source
- Node/Express/FFmpeg backend source
- Firebase Firestore rules
- Firebase Storage rules
- EAS config
- Expo config
- Placeholder app assets
- `.env.example`
- `README.md`

---

## What to do first after extracting

1. Put your Firebase native files in place.
2. Fill in `.env`
3. Start the backend
4. Build an iOS dev client with EAS
5. Test signup, render, preview, paywall, and restore flow on a real iPhone

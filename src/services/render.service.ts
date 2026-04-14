// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\render.service.ts
export interface LocalRenderResult {
  outputUri: string;
}

export async function createRenderJob(): Promise<never> {
  throw new Error(
    'Server rendering has been removed from the app flow. SnapBeat is being migrated to on-device rendering.'
  );
}

export async function getRenderJob(): Promise<never> {
  throw new Error(
    'Server render polling has been removed from the app flow. SnapBeat is being migrated to on-device rendering.'
  );
}

export function getRenderDownloadUrl(): string {
  return '';
}
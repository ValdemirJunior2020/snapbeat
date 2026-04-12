// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\services\purchases.service.ts
export type PurchaseResult = 'success' | 'cancelled' | 'error';

export async function initializePurchases(): Promise<void> {
  return;
}

export async function checkEntitlement(): Promise<boolean> {
  return false;
}

export async function purchaseExportUnlock(): Promise<PurchaseResult> {
  return 'error';
}

export async function restorePurchases(): Promise<boolean> {
  return false;
}
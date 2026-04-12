// FILE: src/services/purchases.service.ts
//
// RevenueCat requires native modules, so this service only works in
// EAS development builds or production binaries. It will not work in Expo Go.

import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesStoreProduct,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE
} from 'react-native-purchases';
import {
  EXPORT_UNLOCK_ENTITLEMENT_ID,
  EXPORT_UNLOCK_PRODUCT_ID,
  RC_API_KEY
} from '@/constants/config';

export async function configurePurchases(userId?: string) {
  if (!RC_API_KEY || Platform.OS === 'web') return;

  Purchases.setLogLevel(LOG_LEVEL.WARN);
  Purchases.configure({ apiKey: RC_API_KEY, appUserID: userId });
}

export async function getUnlockProduct(): Promise<PurchasesStoreProduct | null> {
  if (Platform.OS === 'web' || !RC_API_KEY) return null;
  const products = await Purchases.getProducts([EXPORT_UNLOCK_PRODUCT_ID]);
  return products[0] ?? null;
}

export async function checkEntitlement(): Promise<boolean> {
  if (Platform.OS === 'web' || !RC_API_KEY) return false;
  const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
  return Boolean(customerInfo.entitlements.active[EXPORT_UNLOCK_ENTITLEMENT_ID]);
}

export async function purchaseExportUnlock(): Promise<'success' | 'cancelled' | 'error'> {
  if (Platform.OS === 'web' || !RC_API_KEY) return 'error';

  try {
    const product = await getUnlockProduct();
    if (!product) return 'error';

    const result = await Purchases.purchaseStoreProduct(product);
    const isActive = Boolean(result.customerInfo.entitlements.active[EXPORT_UNLOCK_ENTITLEMENT_ID]);
    return isActive ? 'success' : 'error';
  } catch (error: any) {
    if (error?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return 'cancelled';
    }
    return 'error';
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (Platform.OS === 'web' || !RC_API_KEY) return false;
  const customerInfo = await Purchases.restorePurchases();
  return Boolean(customerInfo.entitlements.active[EXPORT_UNLOCK_ENTITLEMENT_ID]);
}

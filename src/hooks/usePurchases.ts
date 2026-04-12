// FILE: src/hooks/usePurchases.ts
import { useCallback, useEffect, useState } from 'react';
import {
  checkEntitlement,
  getUnlockProduct,
  purchaseExportUnlock,
  restorePurchases
} from '@/services/purchases.service';

export function usePurchases() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [displayPrice, setDisplayPrice] = useState('$1.99');
  const [error, setError] = useState<string | null>(null);

  const refreshEntitlement = useCallback(async () => {
    setIsChecking(true);
    try {
      const product = await getUnlockProduct().catch(() => null);
      if (product?.priceString) {
        setDisplayPrice(product.priceString);
      }

      const unlocked = await checkEntitlement();
      setIsUnlocked(unlocked);
      setError(null);
    } catch (nextError: any) {
      setError(nextError?.message ?? 'Failed to check entitlement.');
    } finally {
      setIsChecking(false);
    }
  }, []);

  const purchase = useCallback(async () => {
    setIsPurchasing(true);
    setError(null);
    try {
      const result = await purchaseExportUnlock();
      if (result === 'success') {
        setIsUnlocked(true);
      } else if (result === 'cancelled') {
        setError('Purchase cancelled.');
      } else {
        setError('Unable to complete purchase.');
      }
      return result;
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setIsPurchasing(true);
    setError(null);
    try {
      const restored = await restorePurchases();
      setIsUnlocked(restored);
      if (!restored) {
        setError('No previous purchases were found.');
      }
      return restored;
    } catch (nextError: any) {
      setError(nextError?.message ?? 'Restore failed.');
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  useEffect(() => {
    refreshEntitlement();
  }, [refreshEntitlement]);

  return {
    isUnlocked,
    isChecking,
    isPurchasing,
    displayPrice,
    error,
    refreshEntitlement,
    purchase,
    restore
  };
}

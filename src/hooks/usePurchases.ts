// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\src\hooks\usePurchases.ts
import { useCallback, useState } from 'react';
import {
  checkEntitlement,
  initializePurchases,
  purchaseExportUnlock,
  restorePurchases,
} from '@/services/purchases.service';

export default function usePurchases() {
  const [loading, setLoading] = useState(false);

  const init = useCallback(async () => {
    setLoading(true);
    try {
      await initializePurchases();
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAccess = useCallback(async () => {
    setLoading(true);
    try {
      return await checkEntitlement();
    } finally {
      setLoading(false);
    }
  }, []);

  const purchase = useCallback(async () => {
    setLoading(true);
    try {
      return await purchaseExportUnlock();
    } finally {
      setLoading(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setLoading(true);
    try {
      return await restorePurchases();
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    init,
    checkAccess,
    purchase,
    restore,
  };
}
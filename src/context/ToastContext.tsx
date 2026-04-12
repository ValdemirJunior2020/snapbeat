// FILE: src/context/ToastContext.tsx
import React, { createContext, PropsWithChildren, useCallback, useMemo, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { ToastMessage } from '@/types';
import Toast from '@/components/ui/Toast';

type ToastState = {
  current: ToastMessage | null;
};

type ToastAction =
  | { type: 'SHOW'; payload: ToastMessage }
  | { type: 'HIDE' };

interface ToastContextValue {
  showToast: (message: string, type?: ToastMessage['type']) => void;
  hideToast: () => void;
}

const initialState: ToastState = {
  current: null
};

function reducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'SHOW':
      return { current: action.payload };
    case 'HIDE':
      return { current: null };
    default:
      return state;
  }
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => undefined,
  hideToast: () => undefined
});

export function ToastProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE' });
  }, []);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const nextMessage: ToastMessage = {
      id: `${Date.now()}`,
      message,
      type
    };
    dispatch({ type: 'SHOW', payload: nextMessage });

    setTimeout(() => {
      dispatch({ type: 'HIDE' });
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View pointerEvents="box-none" style={styles.overlay}>
        {state.current ? <Toast message={state.current} onClose={hideToast} /> : null}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
});

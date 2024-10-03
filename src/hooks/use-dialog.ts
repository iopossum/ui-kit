import React, { useCallback, useRef, useImperativeHandle, useState, Dispatch, SetStateAction } from 'react';

export interface IUseDialogProps<T> {
  ref: React.Ref<IDialogHandle<T>>;
  text?: string;
  resetStateOnHide?: boolean;
  resetPopupStateOnHide?: boolean;
  initialState?: T;
  onHiding?: () => void;
  onSubmit?: (state: T) => void;
  onDecline?: () => void;
}

export interface IDialogHandle<T = object> {
  open: (props?: Partial<T> | null, popupProps?: IDialogState) => Promise<[Error | null, T] | [Error | null]>;
  getState: () => T;
  setState: Dispatch<SetStateAction<T>>;
  getPopupState: () => IDialogState;
  setPopupState: Dispatch<SetStateAction<IDialogState>>;
  close: () => void;
  resolve: () => void;
}

export interface IDialogState {
  text?: string;
  visible?: boolean;
  loading?: boolean;
}

interface IDialogRefs<T> {
  resolve: null | ((result: [Error | null, T] | [Error | null]) => void);
}

export const useDialog = <T = IDialogState>({
  ref,
  text: textFromProps,
  resetStateOnHide = true,
  resetPopupStateOnHide = true,
  initialState,
  onHiding,
  onSubmit,
  onDecline,
}: IUseDialogProps<T>) => {
  const dialogRef = useRef<IDialogRefs<T>>({
    resolve: null,
  });
  const [popupState, setPopupState] = useState<IDialogState>({
    visible: false,
    text: textFromProps,
    loading: false,
  });
  const [state, setState] = useState<T>(initialState || ({} as T));

  const handleHiding = useCallback(() => {
    if (onHiding) {
      onHiding();
      return;
    }
    if (resetStateOnHide) {
      setState(initialState || ({} as T));
    }
    if (resetPopupStateOnHide) {
      setPopupState({ visible: false });
    } else {
      setPopupState((prev) => ({ ...prev, visible: false }));
    }
    dialogRef.current.resolve?.([new Error('hiding')]);
  }, [onHiding, resetStateOnHide, resetPopupStateOnHide, initialState]);

  const handleSubmit = useCallback(
    (v?: T) => {
      if (onSubmit) {
        onSubmit(v!);
        return;
      }
      dialogRef.current.resolve?.([null, v!]);
      handleHiding();
    },
    [onSubmit, handleHiding],
  );

  const handleDecline = useCallback(() => {
    if (onDecline) {
      onDecline();
      return;
    }
    dialogRef.current.resolve?.([new Error('decline')]);
    handleHiding();
  }, [onDecline, handleHiding]);

  useImperativeHandle(
    ref,
    () => ({
      open: async (props, popupProps = {}) => {
        setPopupState((prev) => ({ ...prev, ...popupProps, visible: true }));
        if (props) {
          setState((prev) => ({ ...prev, ...props }));
        }
        return new Promise<[Error | null, T] | [Error | null]>((resolve) => {
          dialogRef.current.resolve = resolve;
        });
      },
      getState: () => state,
      setState,
      getPopupState: () => popupState,
      setPopupState,
      close: handleHiding,
      resolve: () => {
        dialogRef.current.resolve?.([null, state]);
        handleHiding();
      },
    }),
    [state, popupState, handleHiding],
  );
  return {
    popupState,
    state,
    setPopupState,
    setState,
    handleHiding,
    handleSubmit,
    handleDecline,
  };
};

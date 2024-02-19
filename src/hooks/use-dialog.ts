import React, { useCallback, useRef, useImperativeHandle, useState, MouseEvent, Dispatch, SetStateAction } from 'react';

export interface IUseDialogProps<T> {
  ref: React.Ref<IDialogHandle<T>>;
  text?: string;
  resetStateOnHide?: boolean;
  onHiding?: () => void;
  onSubmit?: (e: MouseEvent, state: Partial<T> & IDialogState) => void;
  onDecline?: () => void;
}

export interface IDialogHandle<T = object> {
  open: (props?: Partial<T> & IDialogState) => Promise<Partial<T> & IDialogState>;
  getState: () => Partial<T> & IDialogState;
  setState: Dispatch<SetStateAction<Partial<T> & IDialogState>>;
  close: () => void;
  resolve: () => void;
}

export interface IDialogState {
  text?: string;
  visible?: boolean;
  loading?: boolean;
}

interface IDialogRefs<T> {
  reject: null | (() => void);
  resolve: null | ((e: T) => void);
}

export const useDialog = <T = IDialogState>({
  ref,
  text: textFromProps,
  resetStateOnHide,
  onHiding,
  onSubmit,
  onDecline,
}: IUseDialogProps<T>) => {
  type UnionT = Partial<T> & IDialogState;
  const dialogRef = useRef<IDialogRefs<UnionT>>({
    resolve: null,
    reject: null,
  });
  const [state, setState] = useState<UnionT>({
    visible: false,
    text: textFromProps,
  } as UnionT);

  const handleHiding = useCallback(() => {
    if (onHiding) {
      onHiding();
      return;
    }
    if (resetStateOnHide) {
      setState({ visible: false } as UnionT);
    } else {
      setState((prev) => ({ ...prev, visible: false }) as UnionT);
    }
    dialogRef.current.reject && dialogRef.current.reject();
  }, [onHiding, resetStateOnHide]);

  const handleSubmit = useCallback(
    (e: MouseEvent, v: Partial<T> & IDialogState) => {
      if (onSubmit) {
        onSubmit(e, v);
        return;
      }
      dialogRef.current.resolve && dialogRef.current.resolve(v);
      handleHiding();
    },
    [onSubmit, handleHiding],
  );

  const handleDecline = useCallback(() => {
    if (onDecline) {
      onDecline();
      return;
    }
    dialogRef.current.reject && dialogRef.current.reject();
    handleHiding();
  }, [onDecline, handleHiding]);

  useImperativeHandle(
    ref,
    () => ({
      open: async (props = {}) => {
        setState((prev) => ({ ...prev, ...props, visible: true }));
        return new Promise((resolve, reject) => {
          dialogRef.current.resolve = resolve;
          dialogRef.current.reject = reject;
        });
      },
      getState: () => state,
      setState,
      close: handleHiding,
      resolve: () => {
        dialogRef.current.resolve && dialogRef.current.resolve(state);
        handleHiding();
      },
    }),
    [state, handleHiding],
  );
  return {
    state,
    setState,
    handleHiding,
    handleSubmit,
    handleDecline,
  };
};

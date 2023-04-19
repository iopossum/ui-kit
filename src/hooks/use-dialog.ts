import React, { useCallback, useRef, useImperativeHandle } from 'react';

import { useMergedState } from '@hooks/use-merged-state';

export interface IUseDialogProps<T> {
  ref: React.Ref<IDialogHandle<T>>;
  text?: string;
  onHiding?: () => void;
  onSubmit?: (e: React.MouseEventHandler, state: Partial<T> & IDialogState) => void;
  onDecline?: () => void;
}

export interface IDialogHandle<T = object> {
  open: (props?: Partial<T> & IDialogState) => Promise<Partial<T> & IDialogState>;
  getState: () => Partial<T> & IDialogState;
  setState: (data: Partial<T> & IDialogState) => void;
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
  onHiding,
  onSubmit,
  onDecline,
}: IUseDialogProps<T>) => {
  type UnionT = Partial<T> & IDialogState;
  const dialogRef = useRef<IDialogRefs<UnionT>>({
    resolve: null,
    reject: null,
  });
  const { state, setMergedState } = useMergedState<UnionT>({
    visible: false,
    text: textFromProps,
  } as UnionT);

  const handleHiding = useCallback(() => {
    if (onHiding) {
      onHiding();
      return;
    }
    setMergedState({ visible: false } as UnionT);
    dialogRef.current.reject && dialogRef.current.reject();
  }, [onHiding, setMergedState]);

  const handleSubmit = useCallback(
    (e: React.MouseEventHandler) => {
      if (onSubmit) {
        onSubmit(e, state as UnionT);
        return;
      }
      dialogRef.current.resolve && dialogRef.current.resolve(state);
      handleHiding();
    },
    [onSubmit, handleHiding, state],
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
      open: async (props) => {
        if (props) {
          setMergedState(Object.assign(props, { visible: true }));
        }
        return new Promise((resolve, reject) => {
          dialogRef.current.resolve = resolve;
          dialogRef.current.reject = reject;
        });
      },
      getState: () => state,
      setState: (data) => setMergedState(data),
      close: handleHiding,
      resolve: () => {
        dialogRef.current.resolve && dialogRef.current.resolve(state);
        handleHiding();
      },
    }),
    [state, setMergedState, handleHiding],
  );
  return {
    state,
    setMergedState,
    handleHiding,
    handleSubmit,
    handleDecline,
  };
};

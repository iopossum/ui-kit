import React, { forwardRef, useMemo, PropsWithChildren, memo, FC } from 'react';

import { Popup, IPopupOptions, IToolbarItemProps } from 'devextreme-react/popup';
import ScrollView from 'devextreme-react/scroll-view';

import type { IButtonProps } from '@components/button';
import type { IDialogHandle, IUseDialogProps } from '@hooks/use-dialog';
import { useDialog } from '@hooks/use-dialog';

export type { IDialogHandle, IDialogState } from '@hooks/use-dialog';

export interface IDialogProps<T = object>
  extends PropsWithChildren,
    Omit<IUseDialogProps<T>, 'ref'>,
    Omit<IPopupOptions, 'onHiding'> {
  submitText?: string;
  declineText?: string;
  showSubmitButton?: boolean;
  showDeclineButton?: boolean;
  destroyOnHide?: boolean;
  submitButtonProps?: IButtonProps;
  declineButtonProps?: IButtonProps;
}

export interface IDialogComponent extends FC<IDialogProps<object>> {
  <T extends object>(
    props: IDialogProps<T> & React.RefAttributes<IDialogHandle<T>>,
  ): ReturnType<React.ForwardRefRenderFunction<IDialogHandle<T>, IDialogProps<T>>>;
}

export const Dialog: IDialogComponent = forwardRef(
  <T extends object>(
    {
      text: textFromProps,
      submitText = 'Да',
      declineText = 'Нет',
      onSubmit,
      onDecline,
      onHiding,
      showDeclineButton,
      showSubmitButton,
      destroyOnHide,
      submitButtonProps,
      declineButtonProps,
      children,
      ...rest
    }: IDialogProps<T>,
    ref: React.Ref<IDialogHandle<T>>,
  ) => {
    const { popupState, handleDecline, handleSubmit } = useDialog<T>({
      ref,
      text: textFromProps,
      onDecline,
      onHiding,
      onSubmit,
    });

    const { visible, text, loading } = popupState;

    const toolbarItems = useMemo(() => {
      const result: Array<IToolbarItemProps> = [];
      if (showDeclineButton || showSubmitButton) {
        if (showDeclineButton) {
          result.push({
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
              stylingMode: 'contained',
              type: 'normal',
              text: declineText,
              onClick: handleDecline,
              ...declineButtonProps,
            },
          });
        }
        if (showSubmitButton) {
          result.push({
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            disabled: loading,
            options: {
              stylingMode: 'contained',
              type: 'default',
              text: submitText,
              onClick: () => handleSubmit(),
              ...submitButtonProps,
            },
          });
        }
      }
      return result;
    }, [
      showSubmitButton,
      showDeclineButton,
      handleSubmit,
      handleDecline,
      loading,
      declineText,
      submitText,
      declineButtonProps,
      submitButtonProps,
    ]);

    if (destroyOnHide && !visible) {
      return null;
    }

    return (
      <Popup
        visible={visible}
        onHiding={handleDecline}
        dragEnabled={false}
        toolbarItems={toolbarItems}
        width={500}
        height={150}
        hideOnOutsideClick={false}
        shading={false}
        showTitle={false}
        {...rest}
      >
        <ScrollView width="100%" height="100%">
          <div>{text}</div>
          {children}
        </ScrollView>
      </Popup>
    );
  },
);

export const DialogMemo = memo(Dialog) as typeof Dialog;

import { useCallback, FormEvent } from 'react';

import type { FormikHandlers, FormikHelpers, FormikErrors } from 'formik';

export interface IUseFormValidationCallback<T> {
  handleSubmit: FormikHandlers['handleSubmit'];
  validateForm: FormikHelpers<T>['validateForm'];
  onValidationFailed: (e: FormikErrors<T>) => void;
} 

export const useFormValidationCallback = <T>({ handleSubmit, validateForm, onValidationFailed }: IUseFormValidationCallback<T>) => {
  const handleSubmitWrapper = useCallback(async (e: FormEvent<HTMLFormElement>) => {    
    e.preventDefault();    
    const errors = await validateForm();
    if (Object.keys(errors).length) {
      onValidationFailed(errors);
    } else {
      handleSubmit(e);  
    }
  }, [handleSubmit, validateForm, onValidationFailed]);
  return [handleSubmitWrapper];
}
import React from 'react';
import { ErrorBoundary } from './index';
import { withKnobs, text, object, number } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'ErrorBoundary',
  component: ErrorBoundary,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

const Test = () => {
  throw new Error('Ошибка!');
};

export const Компонент = () => (
  <ErrorBoundary>
    <Test />
  </ErrorBoundary>
);



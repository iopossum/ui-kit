import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { ErrorBoundary } from '@components/error-boundary';

export default {
  title: 'ErrorBoundary',
  component: ErrorBoundary,
} as Meta<typeof ErrorBoundary>;

const Template = () => (
  <ErrorBoundary>
    <Test />
  </ErrorBoundary>
);

export const Basic: StoryObj<typeof ErrorBoundary> = {
  render: Template,
  args: {}
};

const Test = () => {
  throw new Error('Ошибка!');
};

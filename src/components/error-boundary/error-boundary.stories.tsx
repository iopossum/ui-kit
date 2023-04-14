import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ErrorBoundary } from '@components/error-boundary';

export default {
  title: 'ErrorBoundary',
  component: ErrorBoundary,
} as ComponentMeta<typeof ErrorBoundary>;

const Template: ComponentStory<typeof ErrorBoundary> = (args) => (
  <ErrorBoundary>
    <Test />
  </ErrorBoundary>
);

export const Basic = Template.bind({});
Basic.args = {};

const Test = () => {
  throw new Error('Ошибка!');
};

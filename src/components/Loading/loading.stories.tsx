import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Loading, LoadingContainer, LoadingContainerMemo, ILoadingProps, ILoadingContainerProps } from '@components/loading';

export default {
  title: 'Loading',
  component: Loading,
} as Meta<typeof Loading>;

const Template = (props: ILoadingProps) => <Loading {...props} />;

const TemplateContainer = (props: ILoadingContainerProps) => <LoadingContainer {...props} />;
const TemplateContainerMemo = (props: ILoadingContainerProps) => <LoadingContainerMemo {...props} />;

export const Basic: StoryObj<typeof Loading> = {
  render: Template,
  args: {}
};

export const Container: StoryObj<typeof LoadingContainer> = {
  render: TemplateContainer,
  args: {
    loading: true,
  }
};

export const Memo: StoryObj<typeof LoadingContainer> = {
  render: TemplateContainerMemo,
  args: {
    loading: true,
  }
};
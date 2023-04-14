import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Loading, LoadingContainer, LoadingContainerMemo } from '@components/loading';

export default {
  title: 'Loading',
  component: Loading,
} as ComponentMeta<typeof Loading>;

const Template: ComponentStory<typeof Loading> = (args) => <Loading {...args} />;

const TemplateContainer: ComponentStory<typeof LoadingContainer> = (args) => <LoadingContainer {...args} />;
const TemplateContainerMemo: ComponentStory<typeof LoadingContainerMemo> = (args) => <LoadingContainerMemo {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const Container = TemplateContainer.bind({});
Container.args = {
  loading: true,
};

export const Memo = TemplateContainerMemo.bind({});
Memo.args = {
  loading: true,
};
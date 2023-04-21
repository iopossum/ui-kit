import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { withRouter } from 'storybook-addon-react-router-v6';

import { Card, BackLink } from '@components/card';
import { Prompt, IPromptProps, PromptMemo } from '@components/prompt';

export default {
  title: 'Prompt',
  component: Prompt,
  decorators: [
    withRouter,
    (Story) => (
      <div style={{ display: 'flex', flex: 1 }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Prompt>;

const Template = (props: IPromptProps) => (
  <>
    <Card header={<BackLink />}>
      Контент
    </Card>
    <Prompt {...props} />
  </>
);
const TemplateMemo = (props: IPromptProps) => (
  <>
    <Card header={<BackLink />}>
      Контент
    </Card>
    <PromptMemo {...props} />
  </>
);

export const Basic: StoryObj<typeof Prompt> = {
  render: Template,
  args: {
    message: 'Сообщение',
    when: true
  }
};

export const Memo: StoryObj<typeof PromptMemo> = {
  render: TemplateMemo,
  args: {
    message: 'Сообщение',
  }
};
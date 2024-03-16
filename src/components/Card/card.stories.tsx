import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { withRouter } from 'storybook-addon-remix-react-router';

import { Card, CardMemo, BackLink, CardContainer, ICardProps, ICardContainerProps } from '@components/card';

export default {
  title: 'Card',
  component: Card,
  decorators: [
    withRouter,
    (Story) => (
      <div style={{ display: 'flex', flex: 1 }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Card>;

const Template = (props: ICardProps) => <Card {...props}>Контент</Card>;
const TemplateMemo = (props: ICardProps) => <CardMemo {...props}>Контент</CardMemo>;

const TemplateWithBackLink = (props: ICardProps) => (
  <Card {...props} header={<BackLink />}>
    Контент
  </Card>
);

const TemplateCardContainer = (props: ICardContainerProps) => (
  <CardContainer {...props}>
    <Card className={'card_flex1'} header="заголовок">
      Контент
    </Card>
    <Card className={'card_flex1'}>Контент</Card>
  </CardContainer>
);

export const Basic: StoryObj<typeof Card> = {
  render: Template,
  args: {
    header: 'Заголовок',
  },
};

export const Memo: StoryObj<typeof CardMemo> = {
  render: TemplateMemo,
  args: {
    header: 'Заголовок',
  },
};

export const WithBackLink: StoryObj<typeof Card> = {
  render: TemplateWithBackLink,
  name: 'Basic with back link',
  args: {},
};

export const Container: StoryObj<typeof CardContainer> = {
  render: TemplateCardContainer,
  args: {
    direction: 'column',
  },
};

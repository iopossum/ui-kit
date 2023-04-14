import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { withRouter } from '@.storybook/decorators';
import { Card, CardMemo, BackLink, CardContainer } from '@components/card';

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
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args}>Контент</Card>;
const TemplateMemo: ComponentStory<typeof CardMemo> = (args) => <CardMemo {...args}>Контент</CardMemo>;

const TemplateWithBackLink: ComponentStory<typeof Card> = (args) => (
  <Card {...args} header={<BackLink />}>
    Контент
  </Card>
);

const TemplateCardContainer: ComponentStory<typeof CardContainer> = (args) => (
  <CardContainer {...args}>
    <Card className={'card_flex1'} header="заголовок">
      Контент
    </Card>
    <Card className={'card_flex1'}>Контент</Card>
  </CardContainer>
);

export const Basic = Template.bind({});
Basic.args = {
  header: 'Заголовок',
};

export const Memo = TemplateMemo.bind({});
Memo.args = {
  header: 'Заголовок',
};

export const WithBackLink = TemplateWithBackLink.bind({});
WithBackLink.storyName = 'Basic with back link';
WithBackLink.args = {};

export const Container = TemplateCardContainer.bind({});
Container.args = {
  direction: 'column',
};

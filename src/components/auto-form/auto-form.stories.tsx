import React from 'react';
import { Link } from 'react-router-dom';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { useStores } from '@stores';

import { withRouter, withStores, TSimpleStoreItem } from '@.storybook/decorators';
import { AutoFormObservable, AutoForm, AutoFormMemo } from '@components/auto-form';
import { Card } from '@components/card';

const useSampleStoreItem = () => {
  const { SampleStore }: { SampleStore: any } = useStores();
  return {
    currentItem: SampleStore.currentItem,
    insert: () => Promise.resolve({ id: 1 }),
    update: () => Promise.resolve({ id: 1 }),
    changeItem: (data: any) => {
      SampleStore.currentItem = { ...SampleStore.currentItem, ...data };
    },
    columns: [
      {
        dataField: 'field1',
        caption: 'Поле 1',
        required: true,
        group: 'Тестовая группа1',
      },
      {
        dataField: 'field2',
        caption: 'Телефон',
        group: 'Тестовая группа1',
        mask: '+7 000 000 00 00',
      },
      {
        dataField: 'field3',
        caption: 'Только цифры',
        characters: '0-9',
        group: 'Тестовая группа1',
      },
      {
        dataField: 'field4',
        caption: 'Только буквы и пробел',
        characters: 'А-Яа-яA-Za-z\\s',
        group: 'Тестовая группа1',
      },
      {
        dataField: 'field5',
        caption: 'Проверка email',
        group: 'Тестовая группа1',
        patternType: 'email',
      },
      {
        dataField: 'field6',
        caption: 'Тултип',
        group: 'Тестовая группа2',
        tooltip: 'Тестовый тултип',
      },
      {
        dataField: 'field7',
        caption: 'Select',
        group: 'Тестовая группа2',
        frontLookup: true,
        editorOptions: { items: ['da', 'net'] },
      },
      { dataField: 'field8', caption: 'Поле 8', group: 'Тестовая группа2' },
      { dataField: 'field9', caption: 'Поле 9', group: 'Тестовая группа2' },
      { dataField: 'field10', caption: 'Поле 10', visible: false },
    ],
  };
};

const decorators = [
  withStores,
  withRouter,
  (Story: React.FC) => (
    <Card style={{ height: 300 }}>
      <Story />
    </Card>
  ),
];

export default {
  title: 'AutoForm',
  component: AutoForm,
  decorators,
  argTypes: {},
  args: {
    className: 'sdf',
    showSuccess: false,
  },
} as ComponentMeta<typeof AutoForm>;

const Template: ComponentStory<typeof AutoForm> = (args) => <AutoForm<TSimpleStoreItem> {...args} useItem={useSampleStoreItem} idKey='id' />;

const TemplateMemo: ComponentStory<typeof AutoFormMemo> = (args) => <AutoFormMemo<TSimpleStoreItem> {...args} useItem={useSampleStoreItem} />;

const TemplateObservable: ComponentStory<typeof AutoFormObservable> = (args) => (
  <AutoFormObservable<TSimpleStoreItem> {...args} useItem={useSampleStoreItem} />
);

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};

export const WithGroups = Template.bind({});
WithGroups.storyName = 'With group';
WithGroups.args = {
  grouped: true,
};

export const WithPrompt = TemplateObservable.bind({});
WithPrompt.storyName = 'With Prompt';
WithPrompt.play = async ({ canvasElement }) => {
  // const canvas = within(canvasElement);
  // const inputs = canvas.getAllByRole('textbox');
  // await userEvent.type(inputs[0], 'email@provider.com');
};
WithPrompt.decorators = [
  (Story: React.FC) => (
    <div>
      <Link to={'/test'}>Смена роута</Link>
      <div>
        <Story />
      </div>
    </div>
  ),
].concat(decorators as any);

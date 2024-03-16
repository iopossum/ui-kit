import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { observable } from 'mobx';

import { Meta, StoryObj, Decorator } from '@storybook/react';

import { withRouter } from 'storybook-addon-remix-react-router';

import { TSimpleStoreItem } from '@.storybook/decorators';
import { AutoFormObservable, AutoForm, AutoFormMemo, IAutoFormProps } from '@components/auto-form';
import { Card } from '@components/card';

const createSampleStore = () => {
  return {
    data: { id: 1 },
    onInsert: () => Promise.resolve({ id: 1 }),
    onUpdate: () => Promise.resolve({ id: 1 }),
    onChange: function (data: Partial<TSimpleStoreItem>) {
      this.data = { ...this.data, ...data };
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

const store = observable(createSampleStore());

const decorators: Decorator[] = [
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
  parameters: {
    reactRouter: [
      {
        routePath: '/test',
      },
    ],
  },
} as Meta<typeof AutoForm>;

const onSubmit = (e: unknown) => alert(JSON.stringify(e));

const Template = (props: IAutoFormProps) => (
  <AutoForm<TSimpleStoreItem>
    {...props}
    onSubmit={onSubmit}
    data={store.data}
    columns={store.columns}
    idKey="id"
    onUpdate={undefined}
    onInsert={undefined}
  />
);
const TemplateMemo = (props: IAutoFormProps) => (
  <AutoFormMemo<TSimpleStoreItem>
    {...props}
    onSubmit={onSubmit}
    data={store.data}
    columns={store.columns}
    idKey="id"
    onUpdate={undefined}
    onInsert={undefined}
  />
);
const TemplateObservable = (props: IAutoFormProps) => {
  const [data, setData] = useState(store.data);
  return (
    <AutoFormObservable<TSimpleStoreItem>
      {...props}
      onSubmit={onSubmit}
      columns={store.columns}
      onUpdate={undefined}
      onInsert={undefined}
      data={data}
      onChange={(e) => setData({ ...data, ...e })}
      idKey="id"
    />
  );
};

export const Basic: StoryObj<typeof AutoForm> = {
  render: Template,
};

export const Memo: StoryObj<typeof AutoFormMemo> = {
  render: TemplateMemo,
};

export const WithGroups: StoryObj<typeof AutoForm> = {
  name: 'With group',
  render: Template,
  args: {
    grouped: true,
  },
};

export const WithPrompt: StoryObj<typeof AutoFormObservable> = {
  name: 'With Prompt',
  render: TemplateObservable,
  args: {
    grouped: true,
  },
  decorators: [
    (Story: React.FC) => (
      <div>
        <Link to={'/test'}>Смена роута</Link>
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
};

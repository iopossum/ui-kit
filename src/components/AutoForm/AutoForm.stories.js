import React, { useCallback } from 'react';
import { AutoForm } from './index';
import { useObserver } from 'mobx-react-lite';
import { withKnobs, text, object, number, boolean, select } from "@storybook/addon-knobs";
import { withInfo, withRouter, withStores } from '../../../.storybook/decorators';
import { Card } from '../Card';
import { Link } from 'react-router-dom';
import { useStores } from '../../stores';
import { storiesOf } from '@storybook/react';


const useSampleStoreItem = () => {
  const { SampleStore } = useStores();
  return useObserver(() => ({
    currentItem: SampleStore.currentItem,
    createItem: () => ({id: 1}),
    updateItem: () => {},
    changeItem: (data) => {
      SampleStore.currentItem = { ...SampleStore.currentItem, ...data };
    },
    columns: [
      {dataField: 'field1', caption: 'Поле 1', required: true, group: 'Тестовая группа1'},
      {dataField: 'field2', caption: 'Телефон', group: 'Тестовая группа1', mask: "+7 000 000 00 00"},
      {dataField: 'field3', caption: 'Только цифры', characters: "0-9", group: 'Тестовая группа1'},
      {dataField: 'field4', caption: 'Только буквы и пробел', characters: "А-Яа-яA-Za-z\\s", group: 'Тестовая группа1'},
      {dataField: 'field5', caption: 'Проверка email', group: 'Тестовая группа1', patternType: 'email'},
      {dataField: 'field6', caption: 'Тултип', group: 'Тестовая группа2', tooltip: 'Тестовый тултип'},
      {dataField: 'field7', caption: 'Select', group: 'Тестовая группа2', frontLookup: true, editorOptions: {items: ['da', 'net']}},
      {dataField: 'field8', caption: 'Поле 8', group: 'Тестовая группа2'},
      {dataField: 'field9', caption: 'Поле 9', group: 'Тестовая группа2'},
      {dataField: 'field10', caption: 'Поле 10', visible: false}
    ],
  }));
};

const decorators = [
  withKnobs,
  withInfo(),
  withStores,
  withRouter,
  (story) => <Card style={{ height: 400 }}>{story()}</Card>
];

storiesOf('AutoForm', module)
  .addParameters({
    decorators
  })
  .add('Компонент', () => (
    <AutoForm
      useItem={useSampleStoreItem}
      className={text("className", "")}
      showSuccess={boolean("showSuccess", false)}
      showSubmitButton={boolean("showSubmitButton", true)}
      labelLocation={select('labelLocation', AutoForm.propTypesConstants.labelLocation, AutoForm.defaultProps.labelLocation)}
      dataPropCanChanged="field2"
      onSubmit={v => {
        console.log(v)
      }}
      style={object("style", {})}
    />
  ))
  .add('С группировкой', () => (
    <AutoForm
      useItem={useSampleStoreItem}
      className={text("className", "")}
      showSuccess={boolean("showSuccess", false)}
      showSubmitButton={boolean("showSubmitButton", true)}
      labelLocation={select('labelLocation', AutoForm.propTypesConstants.labelLocation, AutoForm.defaultProps.labelLocation)}
      dataPropCanChanged="field2"
      grouped
      style={object("style", {})}
    />
  ))
  .add('with Prompt', () => {
    return (
      <AutoForm
        useItem={useSampleStoreItem}
        className={text("className", "")}
        showSuccess={boolean("showSuccess", false)}
        showSubmitButton={boolean("showSubmitButton", true)}
        labelLocation={select('labelLocation', AutoForm.propTypesConstants.labelLocation, AutoForm.defaultProps.labelLocation)}
        style={object("style", {})}
      />
    );
  }, { decorators: [story => <div><Link to={'/test'}>Смена роута</Link><div>{story()}</div></div>].concat(decorators) });



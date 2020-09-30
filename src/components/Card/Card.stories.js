import React from 'react';
import { Card, BackLink, CardContainer } from './index';
import { withKnobs, text, object, number, select } from "@storybook/addon-knobs";
import { withInfo, withRouter } from '../../../.storybook/decorators';

export default {
  title: 'Card',
  component: Card,
  decorators: [
    withKnobs,
    withInfo(),
    withRouter
  ]
};

export const Компонент = () => (
  <Card
    className={text("className", "")}
    style={object("style", {})}
    children={text("children", "body")}
    header={text("header", "Заголовок")}
  />
);

export const withBackLink = () => (
  <Card
    className={text("className", "card_flex1")}
    style={object("style", {})}
    headerComponent={<BackLink />}
  >
    Контент
  </Card>
);

export const cardContainer = () => (
  <CardContainer direction={select('direction', CardContainer.propTypesConstants.direction, CardContainer.defaultProps.direction)}>
    <div />
    <Card
      className={"card_flex1"}
      header="заголовок"
    >
      Контент
    </Card>
    <Card
      className={"card_flex1"}
    >
      Контент
    </Card>
  </CardContainer>
);

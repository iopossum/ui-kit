import React from 'react';
import { SecurePage } from './index';
import { MediaWrapper } from '../MediaWrapper';
import { error } from '../../utils/Api';
import { useObserver } from 'mobx-react-lite';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withRouter, withInfo, routes, withStores } from '../../../.storybook/decorators';
import { useStores, useAppStoreMedia } from '../../stores';
import { storiesOf } from '@storybook/react';
import Button from 'devextreme-react/button';
import {Footer} from "@components/Footer";

const SecurePageStory = () => {
  const { matches } = useAppStoreMedia();
  return (
    <SecurePage
      className={text("className", "")}
      style={object("style", {})}
      routes={routes}
      onLogout={() => error('logout')}
      cookiePrefix={text("cookiePrefix", "storybook_")}
      showLogo={boolean("showLogo", true)}
      username={text("username", "")}
    >
      <div className="header"><Button icon="refresh" /></div>
      <div className="content">{ Array.from({ length: 100 }).map((v, i) => <div key={i}>{i}</div>) }</div>
      <Footer />
    </SecurePage>
  );
};

const decorators = [
  withKnobs,
  withInfo(),
  withStores,
  withRouter,
];

storiesOf('SecurePage', module)
  .addParameters({
    decorators
  })
  .add('Компонент', () => {
    return <MediaWrapper><SecurePageStory/></MediaWrapper>
  });



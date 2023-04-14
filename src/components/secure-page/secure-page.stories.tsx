import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { withRouter, routes } from '@.storybook/decorators';
import { Button } from '@components/button';
import { Footer } from "@components/footer";
import { SecurePage, SecurePageMemo } from '@components/secure-page';

export default {
  title: 'SecurePage',
  component: SecurePage,
  decorators: [
    withRouter
  ]
} as ComponentMeta<typeof SecurePage>;

const Template: ComponentStory<typeof SecurePage> = (args) => (
  <SecurePage
    username={'asd'}
    {...args}
    routes={routes}
    cookiePrefix='storybook'    
    versionComponent={<>Build: 1.0.154</>}
  >
    <div className="header"><Button icon="refresh" /></div>
    <div className="content">{ Array.from({ length: 100 }).map((v, i) => <div key={i}>{i}</div>) }</div>
    <Footer />
  </SecurePage>
);

const TemplateMemo: ComponentStory<typeof SecurePageMemo> = (args) => (
  <SecurePageMemo
    username={'asd'}
    {...args}
    routes={routes}
    cookiePrefix='storybook'    
    versionComponent={<>Build: 1.0.154</>}
  >
    <div className="header"><Button icon="refresh" /></div>
    <div className="content">{ Array.from({ length: 100 }).map((v, i) => <div key={i}>{i}</div>) }</div>
    <Footer />
  </SecurePageMemo>
);

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};
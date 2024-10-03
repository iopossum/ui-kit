import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { withRouter } from 'storybook-addon-remix-react-router';

import { routes } from '@.storybook/decorators';
import { Button } from '@components/button';
import { Footer } from '@components/footer';
import { SecurePage, SecurePageMemo, ISecurePageProps } from '@components/secure-page';

export default {
  title: 'SecurePage',
  component: SecurePage,
  decorators: [withRouter],
} as Meta<typeof SecurePage>;

const Template = (props: ISecurePageProps) => (
  <SecurePage
    username={'asd'}
    {...props}
    routes={routes}
    cookiePrefix="storybook"
    versionComponent={<>Build: 1.0.154</>}
  >
    <div className="header">
      <Button icon="refresh" />
    </div>
    <div className="content">
      {Array.from({ length: 100 }).map((v, i) => (
        <div key={i}>{i}</div>
      ))}
    </div>
    <Footer />
  </SecurePage>
);

const TemplateMemo = (props: ISecurePageProps) => {
  return (
    <SecurePageMemo
      username={'asd'}
      {...props}
      routes={routes}
      cookiePrefix="storybook"
      versionComponent={<>Build: 1.0.154</>}
    >
      <div className="header">
        <Button icon="refresh" />
      </div>
      <div className="content">
        {Array.from({ length: 100 }).map((v, i) => (
          <div key={i}>{i}</div>
        ))}
      </div>
      <Footer />
    </SecurePageMemo>
  );
};

export const Basic: StoryObj<typeof SecurePage> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof SecurePageMemo> = {
  render: TemplateMemo,
  args: {},
};

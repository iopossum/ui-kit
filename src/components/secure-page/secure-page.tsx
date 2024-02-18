import React, { useCallback, useState, PropsWithChildren, memo } from 'react';
import ReactSidebar from 'react-sidebar';
import type { SidebarProps } from 'react-sidebar';

import cn from 'classnames';

import { Page } from '@components/page';
import { Sidebar, SidebarToggle, SIDEBAR_SIZE } from '@components/sidebar';
import type { TSidebarSize, ISidebarProps } from '@components/sidebar';
import { useMediaQuery } from '@hooks/use-media-query';
import { getCookie, setCookie } from '@utils/cookie';

import './secure-page.scss';

export interface ISecurePageProps extends PropsWithChildren, Omit<ISidebarProps, 'sidebar'> {
  cookiePrefix: string;
  reactSidebarProps?: SidebarProps;
}

export const SecurePage = ({
  className,
  style,
  cookiePrefix,
  children,
  reactSidebarProps,
  ...props
}: ISecurePageProps) => {
  const [sidebar, setSidebar] = useState<TSidebarSize>(() => {
    const fromCookie = getCookie(`${cookiePrefix}sidebar`);
    return fromCookie && SIDEBAR_SIZE.indexOf(fromCookie) > -1 ? fromCookie : SIDEBAR_SIZE[0];
  });
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 960px)');

  const onChange = useCallback<NonNullable<ISidebarProps['onChange']>>(
    (value) => {
      setSidebar(value);
      setCookie(`${cookiePrefix}sidebar`, value);
    },
    [cookiePrefix],
  );

  return (
    <Page
      style={style}
      className={cn('page_secure', {
        [className as string]: !!className,
        page_secure_lg: sidebar === 'sm',
      })}
    >
      <ReactSidebar
        docked={isDesktop}
        sidebar={
          <Sidebar
            sidebar={!isDesktop ? 'sm' : sidebar}
            onChange={(v) => (!isDesktop ? setSidebarOpened(false) : onChange(v))}
            onFollowRoute={(v) => (!isDesktop ? setSidebarOpened(false) : null)}
            {...props}
          />
        }
        open={sidebarOpened}
        onSetOpen={() => setSidebarOpened(false)}
        styles={{
          sidebar: { position: 'fixed', zIndex: '3', overflow: 'hidden' },
          root: { position: 'initial' },
          content: { width: '50px' },
        }}
        {...reactSidebarProps}
      >
        {!isDesktop ? (
          <SidebarToggle onClick={() => setSidebarOpened(true)} className="sidebar__toggle_mobile" />
        ) : (
          <div />
        )}
      </ReactSidebar>
      <div className="page_secure__content">{children}</div>
    </Page>
  );
};

SecurePage.defaultProps = {
  routes: [],
  showLogout: true,
};

export const SecurePageMemo = memo(SecurePage);

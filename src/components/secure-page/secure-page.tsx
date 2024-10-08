import React, { useCallback, useState, PropsWithChildren, memo } from 'react';
import ReactSidebar from 'react-sidebar';
import type { SidebarProps } from 'react-sidebar';

import cn from 'classnames';

import { Page } from '@components/page';
import { SidebarMemo, SidebarToggle, SIDEBAR_SIZE } from '@components/sidebar';
import type { TSidebarSize, ISidebarProps } from '@components/sidebar';
import { useMediaQuery } from '@hooks/use-media-query';
import { getCookie, setCookie } from '@utils/cookie';

import './secure-page.scss';

export interface ISecurePageProps extends PropsWithChildren, Omit<ISidebarProps, 'sidebar'> {
  cookiePrefix: string;
  reactSidebarProps?: SidebarProps;
  onSidebarChange?: (v: TSidebarSize) => void;
}

export const SecurePage = ({
  className,
  style,
  cookiePrefix,
  children,
  reactSidebarProps,
  onFollowRoute,
  onSidebarChange,
  ...props
}: ISecurePageProps) => {
  const [sidebar, setSidebar] = useState<TSidebarSize>(() => {
    const fromCookie = getCookie(`${cookiePrefix}sidebar`);
    return fromCookie && SIDEBAR_SIZE.indexOf(fromCookie) > -1 ? fromCookie : SIDEBAR_SIZE[0];
  });
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 960px)');

  const handleChange = useCallback<NonNullable<ISidebarProps['onChange']>>(
    (value) => {
      if (!isDesktop) {
        setSidebarOpened(false);
      }
      setSidebar(value);
      setCookie(`${cookiePrefix}sidebar`, value);
      onSidebarChange?.(value);
    },
    [cookiePrefix, isDesktop, onSidebarChange],
  );

  const handleFollowRoute = useCallback<NonNullable<ISidebarProps['onFollowRoute']>>(
    (value) => {
      if (!isDesktop) {
        setSidebarOpened(false);
      }
      onFollowRoute?.(value);
    },
    [isDesktop, onFollowRoute],
  );

  const handleOpen = useCallback(() => {
    setSidebarOpened(true);
  }, []);

  const handleClose = useCallback(() => {
    setSidebarOpened(false);
  }, []);

  return (
    <Page
      style={style}
      className={cn('page__secure', {
        [className as string]: !!className,
        page__secure_lg: sidebar === 'sm',
      })}
    >
      <ReactSidebar
        docked={isDesktop}
        sidebar={
          <SidebarMemo
            sidebar={!isDesktop ? 'sm' : sidebar}
            onChange={handleChange}
            onFollowRoute={handleFollowRoute}
            showLogout
            {...props}
          />
        }
        open={sidebarOpened}
        onSetOpen={handleClose}
        styles={{
          sidebar: { position: 'fixed', zIndex: '3', overflow: 'hidden' },
          root: { position: 'initial' },
          content: { width: '50px' },
        }}
        {...reactSidebarProps}
      >
        {!isDesktop ? <SidebarToggle onClick={handleOpen} className="sidebar__toggle_mobile" /> : <div />}
      </ReactSidebar>
      <div className="page__secure__content">{children}</div>
    </Page>
  );
};

export const SecurePageMemo = memo(SecurePage);

import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, arrayOf, node, object, array, func } from 'prop-types';
import { Sidebar, SidebarToggle } from '@components/Sidebar';
import { getCookie, setCookie } from '@utils/Cookie';
import { useAppStoreMedia } from '@stores';
import { Page } from '@components/Page';
import ReactSidebar from "react-sidebar";

import './SecurePage.scss';

export const SecurePage = ({
  className,
  style,
  cookiePrefix,
  children,
  ...props
}) => {

  const cookieSidebar = useRef(getCookie(`${cookiePrefix}sidebar`));
  const [sidebar, setSidebar] = useState(cookieSidebar.current && ['lg', 'sm'].indexOf(cookieSidebar.current) > -1 ? cookieSidebar.current : 'lg');
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const { matches } = useAppStoreMedia();

  const onChange = useCallback((value) => {
    setSidebar(value);
    setCookie(`${cookiePrefix}sidebar`, value);
  }, [sidebar]);

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <Page style={style} className={cn('page_secure', {[className]: !!className, 'page_secure_lg': sidebar === 'sm'})}>
      <ReactSidebar
        docked={!matches.small}
        sidebar={<Sidebar
          showLogout
          sidebar={matches.small ? 'lg' : sidebar}
          onChange={(v) => matches.small ? setSidebarOpened(false) : onChange(v)}
          onFollowRoute={(v) => matches.small ? setSidebarOpened(false) : null}
          {...props}
        />}
        open={sidebarOpened}
        onSetOpen={() => setSidebarOpened(false)}
        styles={{ sidebar: { overflowY: "initial" }, root: { position: 'initial' }, content: { width: 50 } }}
      >
        { matches.small ? <SidebarToggle onClick={() => setSidebarOpened(true)} className="sidebar__toggle_mobile" /> : <div /> }
      </ReactSidebar>
      <div className="page_secure__content">
        { memoizedChildren }
      </div>
    </Page>
  );
};

SecurePage.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Роуты */
  routes: array,
  /** Logout callback*/
  onLogout: func,
  /** Префикс для сохранения в cookies */
  cookiePrefix: string,
  /** children */
  children: node
};

SecurePage.defaultProps = {
  routes: [],
  showLogout: true,
  cookiePrefix: ''
};

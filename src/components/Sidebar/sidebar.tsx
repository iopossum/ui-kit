import React, { useCallback, useState, useMemo, useEffect, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';

import PoweroffOutlined from '@ant-design/icons/PoweroffOutlined';
import cn from 'classnames';
import TreeView from 'devextreme-react/tree-view';
import type { ITreeViewOptions } from 'devextreme-react/tree-view';

import type { IWithStyles, IRoute } from '@types';

import { SidebarLink } from './sidebar-link';
import { SidebarToggle } from './sidebar-toggle';

import './sidebar.scss';

const TreeViewMemo = memo(TreeView);

export const SIDEBAR_SIZE = ['lg', 'sm'] as const;
export type TSidebarSize = (typeof SIDEBAR_SIZE)[number];

export interface ISidebarProps extends IWithStyles, Omit<ITreeViewOptions, 'style'> {
  routes: IRoute[];
  sidebar: TSidebarSize;
  versionHeight?: number;
  logoutHeight?: number;
  showLogout?: boolean;
  showLogo?: boolean;
  username?: string | React.ReactElement;
  versionComponent?: string | React.ReactElement;
  onLogout?: React.MouseEventHandler<HTMLDivElement>;
  onChange?: (e: TSidebarSize) => void;
  onFollowRoute?: (e: IRoute) => void;
}

export const Sidebar = ({
  className,
  style,
  showLogout,
  routes,
  sidebar,
  showLogo,
  username,
  versionHeight,
  logoutHeight,
  versionComponent,
  onLogout,
  onChange,
  onFollowRoute,
  ...rest
}: ISidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [routesDataSource, setRoutesDataSource] = useState<IRoute[]>([]);

  const onClick = useCallback<NonNullable<ITreeViewOptions['onItemClick']>>(
    (e) => {
      const { itemData, event } = e;
      if (itemData) {
        if (itemData.onClick) {
          itemData.onClick(event);
          return;
        }
        if (!itemData.abstract) {
          if (onFollowRoute) {
            onFollowRoute(itemData as IRoute);
            return;
          }
          setTimeout(() => navigate(itemData.path), 0);
        }
      }
    },
    [navigate, onFollowRoute],
  );

  const ItemComponent = useCallback<NonNullable<ITreeViewOptions['itemComponent']>>(
    (props) => {
      return <SidebarLink {...props} allowTooltip={sidebar === 'sm'} />;
    },
    [sidebar],
  );

  const enchantedRoutes = useMemo(() => {
    const array = routes
      .filter((v) => v.displayOnSidebar)
      .map((v) => {
        return {
          ...v,
          expanded: v.expanded || location.pathname.startsWith(v.path),
          selected: location.pathname.startsWith(v.path),
          children: v.children
            ? v.children
                .filter((v) => !!v.path && v.displayOnSidebar)
                .map((c) => ({
                  ...c,
                  path: `${v.path}${c.path}`,
                  selected: location.pathname === `${v.path}${c.path}`,
                }))
            : [],
        };
      });
    return array;
  }, [routes, location.pathname]);

  useEffect(() => {
    setRoutesDataSource(enchantedRoutes);
  }, [enchantedRoutes]);

  const onToggle = useCallback(() => {
    const value = sidebar === 'lg' ? 'sm' : 'lg';
    onChange?.(value);
  }, [sidebar, onChange]);

  const classes = cn('sidebar', `sidebar_${sidebar}`, {
    [className as string]: !!className,
    'sidebar_with-user': !!username,
  });

  return (
    <nav className={classes} style={style}>
      <div className="sidebar__header">
        {showLogo ? (
          <div className="sidebar__logo__container">
            <div className="sidebar__logo" />
          </div>
        ) : (
          <div />
        )}
        <SidebarToggle onClick={onToggle} />
      </div>
      {username && <div className="sidebar__user">{username}</div>}
      <div className="sidebar__navigation">
        <AutoSizer disableHeight={false} disableWidth>
          {({ height }) => {
            let h = showLogout ? height - (logoutHeight || 0) : height;
            if (versionHeight && versionComponent) {
              h = h - (versionHeight || 0);
            }
            return (
              <>
                <TreeViewMemo
                  height={h}
                  dataSource={routesDataSource}
                  expandEvent="click"
                  selectionMode="single"
                  itemsExpr="children"
                  keyExpr="path"
                  selectByClick={true}
                  hoverStateEnabled={false}
                  activeStateEnabled={false}
                  focusStateEnabled={false}
                  itemComponent={ItemComponent}
                  onItemClick={onClick}
                  {...rest}
                />
                {showLogout && (
                  <div style={{ position: 'relative' }}>
                    <SidebarLink
                      className="custom"
                      data={{
                        title: 'Выход',
                        iconComponent: <PoweroffOutlined />,
                        onClick: onLogout,
                      }}
                      allowTooltip={sidebar === 'sm'}
                    />
                  </div>
                )}
                {!!versionComponent && <div className="version">{versionComponent}</div>}
              </>
            );
          }}
        </AutoSizer>
      </div>
    </nav>
  );
};

Sidebar.defaultProps = {
  routes: [],
  showLogout: true,
  showLogo: true,
  versionHeight: 27,
  logoutHeight: 45,
};

export const SidebarMemo = memo(Sidebar);

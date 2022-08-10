import React, { useCallback, useState, useMemo, useEffect } from 'react';
import cn from 'classnames';
import { string, func, number, oneOfType, arrayOf, node, object, array, bool, oneOf } from 'prop-types';
import { Link, useLocation, useHistory } from 'react-router-dom';
import TreeView from 'devextreme-react/tree-view';
import Button from 'devextreme-react/button';
import { Capitalize } from '@components/Capitalize';
import { Tooltip } from '@components/Tooltip';
import { Autosize } from '@components/Autosize';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';

import './Sidebar.scss';

const SidebarLink = ({ data, sidebar, style }) => {
  return (
    <Tooltip
      className="navigation-item"
      position="right"
      disabled={sidebar !== 'sm'}
      tooltipContent={data.title}
      style={style}
    >
      { data.icon || data.iconComponent ? (
        <i className={cn(`dx-icon`, {[data.icon]: !!data.icon, 'dx-icon-component': !!data.iconComponent})}>{data.iconComponent}</i>
      ) : (
        <Capitalize className="navigation-item__capitalize" text={data.title} />
      )}
      <span className="navigation-item__text">{data.title}</span>
    </Tooltip>
  );
};

export const SidebarToggle = ({ onClick, className }) => (
  <div className={cn('sidebar__toggle', {[className]: !!className})}>
    <Button icon="menu" onClick={onClick} />
  </div>
);

export const Sidebar = ({
  className,
  style,
  onLogout,
  onChange,
  onFollowRoute,
  showLogout,
  routes,
  sidebar,
  showLogo,
  username,
  logoStyle
}) => {

  const location = useLocation();
  const history = useHistory();

  const [routesDataSource, setRoutesDataSource] = useState([]);

  const onClick = useCallback(({ itemData }) => {
    if (itemData.onClick) {
      return itemData.onClick;
    }
    if (!itemData.abstract) {
      onFollowRoute && onFollowRoute();
      setTimeout(() => history.push(itemData.path), 0);
    }
  }, [routes]);

  const onSelectionChanged = useCallback(({ component }) => {
    // setRoutesDataSource(component.getDataSource()._items);
  }, []);

  const enchantedRoutes = useMemo(() => {
    const array = routes
      .filter(v => v.displayOnSidebar).map(v => {
        return ({
          ...v,
          expanded: v.expanded || location.pathname.startsWith(v.path),
          selected: location.pathname.startsWith(v.path),
          children: v.children ? v.children.map(c => ({...c, path: `${v.path}${c.path}`, selected: location.pathname === `${v.path}${c.path}`})) : []
        });
      });
    if (showLogout){
      // array.push({title: 'Выход', iconComponent: <PowerSettingsNew />, onClick: onLogout});
    }
    return array;
  }, [routes]);

  useEffect(() => {
    setRoutesDataSource(enchantedRoutes);
  }, [enchantedRoutes]);

  const onToggle = useCallback(() => {
    const value = sidebar === 'lg' ? 'sm' : 'lg';
    onChange(value);
  }, [sidebar]);

  const classes = cn(
    'sidebar',
    `sidebar_${sidebar}`,
    {[className]: !!className, 'sidebar_with-user': !!username }
  );

  return (
    <nav className={classes} style={style}>
      <div className="sidebar__header">
        { showLogo ? (
          <div className="sidebar__logo__container">
            <div className="sidebar__logo" />
          </div>
        ) : <div />}
        <SidebarToggle onClick={onToggle} />
      </div>
      { username && (
        <div className="sidebar__user">
          { username }
        </div>
      )}
      <div className="sidebar__navigation">
        <Autosize
          renderOnZero={false}
          disableHeight={false}
          disableWidth
          component={({ height }) => (
            <>
              <TreeView
                height={showLogout ? height - 40 : height}
                dataSource={routesDataSource}
                expandEvent="click"
                selectionMode="single"
                itemsExpr="children"
                keyExpr="path"
                selectByClick={true}
                hoverStateEnabled={false}
                activeStateEnabled={false}
                focusStateEnabled={false}
                itemComponent={(props) => <SidebarLink {...props} sidebar={sidebar} />}
                onItemClick={onClick}
                onSelectionChanged={onSelectionChanged}
              />
              { showLogout && (
                <SidebarLink style={{ marginTop: 10 }} data={{title: 'Выход', iconComponent: <PowerSettingsNew />, onClick: onLogout}} sidebar={sidebar} />
              ) }
            </>
          )}
        />
      </div>
    </nav>

  );
};

Sidebar.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Роуты */
  routes: array,
  /** Logout callback*/
  onLogout: func,
  /** onChange callback*/
  onChange: func,
  /** Видимость кнопки logout */
  showLogout: bool,
  /** Тип сайдбара (lg, sm) */
  sidebar: oneOf(['lg', 'sm']),
  /** showLogo */
  showLogo: bool,
  /** username */
  username: oneOfType([object, string]),
  /** Кастомный стиль лого */
  logoStyle: oneOfType([object, array]),
};

Sidebar.defaultProps = {
  routes: [],
  showLogout: true,
  showLogo: true,
};

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Grid, Menu } from '@alife/aisc';
import Article from './Article';
import ComponentDoc from './ComponentDoc';
import * as utils from '../utils';
import config from '../../';

const {Col, Row} = Grid;
const SubMenu = Menu.SubMenu;

function getActiveMenuItem(props) {
  const children = props.params.children;
  return (children && children.replace('-en', '')) ||
    props.location.pathname.replace(/(^\/|-en$)/g, '');
}
function isNotTopLevel(level) {
  return level !== 'topLevel';
}

function getModuleData(props) {
  const pathname = props.location.pathname.replace(`${config.routes.prefix}`,'');
  const moduleName = /^\/?components/.test(pathname) ?
          'components' : pathname.split('/').filter(item => item).slice(0, 1).join('/');
  
  const moduleData = moduleName === 'components'  ?
          [...props.picked.components]  : props.picked[moduleName];
  const suffix = utils.isEnUS(props.location.pathname) ? 'en-US.md' : 'zh-CN.md';
  return moduleData.filter(({ meta }) => {return meta.filename.endsWith(suffix)});
}

function fileNameToPath(filename) {
  const snippets = filename.replace(/(\/index)?((\.zh-CN)|(\.en-US))?\.md$/i, '').split('/');
  return snippets[snippets.length - 1];
}

export default class MainContent extends React.Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { openKeys: this.getSideBarOpenKeys(props) || [] };
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentWillReceiveProps(nextProps) {
    const openKeys = this.getSideBarOpenKeys(nextProps);
    if (openKeys) {
      this.setState({ openKeys });
    }
  }

  componentDidUpdate() {
    if (!location.hash) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        document.getElementById(decodeURI(location.hash.replace('#', ''))).scrollIntoView();
      }, 10);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleMenuOpenChange = (openKeys) => {
    this.setState({ openKeys });
  }

  getSideBarOpenKeys(nextProps) {
    const pathname = nextProps.location.pathname;
    const prevModule = this.currentModule;
    this.currentModule = pathname.replace(/^\//).split('/')[1] || 'components';
    if (this.currentModule === 'react') {
      this.currentModule = 'components';
    }
    const locale = utils.isEnUS(pathname) ? 'en-US' : 'zh-CN';
    if (prevModule !== this.currentModule) {
      const moduleData = getModuleData(nextProps);
      const shouldOpenKeys = Object.keys(utils.getMenuItems(moduleData, locale));
      return shouldOpenKeys;
    }
  }

  generateMenuItem(isTop, item) {
    const locale = this.context.intl.locale;
    const key = fileNameToPath(item.filename);
    const text = isTop ?
            item.title[locale] || item.title : [
              <span className="chinese" key="chinese">{item.subtitle}</span>,
              <span key="english">{item.title}</span>
            ];
    const disabled = item.disabled;
    const url = item.filename.replace(/(\/index)?((\.zh-CN)|(\.en-US))?\.md$/i, '').replace(/^docs\//,'').toLowerCase();
    const child = !item.link ? (
      <Link
        to={`${url}/`}
        disabled={disabled}
      >
        {text}
      </Link>
    ) : (
      <a href={item.link} target="_blank" rel="noopener noreferrer" disabled={disabled}>
        {text}
      </a>
    );

    return (
      <Menu.Item key={key.toLowerCase()} disabled={disabled}>
        {child}
      </Menu.Item>
    );
  }

  generateSubMenuItems(obj) {
    if (!obj){return []}
    const topLevel = (obj.topLevel || []).map(this.generateMenuItem.bind(this, true));
    const itemGroups = Object.keys(obj).filter(isNotTopLevel)
      .sort((a, b) => config.typeOrder[a] - config.typeOrder[b])
      .map((type) => {
        const groupItems = obj[type].sort((a, b) => {
          return a.title.charCodeAt(0) -
          b.title.charCodeAt(0);
        }).map(this.generateMenuItem.bind(this, false));
        return (
          <Menu.Group label={type} key={type}>
            {groupItems}
          </Menu.Group>
        );
      });
     return [...topLevel, ...itemGroups];
  }

  getMenuItems() {
    const moduleData = getModuleData(this.props);
    const menuItems = utils.getMenuItems(
      moduleData, this.context.intl.locale
    );
    const topLevel = this.generateSubMenuItems(menuItems.topLevel);
    const subMenu = Object.keys(menuItems).filter(isNotTopLevel)
      .sort((a, b) => config.categoryOrder[a] - config.categoryOrder[b])
      .map((category) => {
        const subMenuItems = this.generateSubMenuItems(menuItems[category]);
        return (
          <SubMenu label={<h4>{category}</h4>} key={category}>
            {subMenuItems}
          </SubMenu>
        );
      });
    return [...topLevel, ...subMenu];
  }

  flattenMenu(menu) {
    if (menu.type === Menu.Item) {
      return menu;
    }

    if (Array.isArray(menu)) {
      return menu.reduce((acc, item) => acc.concat(this.flattenMenu(item)), []);
    }

    return this.flattenMenu(menu.props.children);
  }

  getFooterNav(menuItems, activeMenuItem) {
    const menuItemsList = this.flattenMenu(menuItems);
    let activeMenuItemIndex = -1;
    menuItemsList.forEach((menuItem, i) => {
      if (menuItem.key === activeMenuItem) {
        activeMenuItemIndex = i;
      }
    });
    const prev = menuItemsList[activeMenuItemIndex - 1];
    const next = menuItemsList[activeMenuItemIndex + 1];
    return { prev, next };
  }

  render() {
    const props = this.props;
    const activeMenuItem = getActiveMenuItem(props);
    const menuItems = this.getMenuItems();
    const { prev, next } = this.getFooterNav(menuItems, activeMenuItem);
    const localizedPageData = props.localizedPageData;
    return (
      <div className="main-wrapper">
        <Row isMobile={true}>
          <Col span="4">
            <div className="siderbar">
            <Menu 
              className="menu"
              mode="inline"
              openKeys={this.state.openKeys}
              selectedKeys={[activeMenuItem]}
              onOpenChange={this.handleMenuOpenChange}
            >
              {menuItems}
            </Menu>
            </div>
          </Col>
          <Col span="20" className={'main-container' + (props.demos ? ' main-container-component' :'')}>
            {
              props.demos ?
                <ComponentDoc {...props} doc={localizedPageData} demos={props.demos} /> :
                <Article {...props} content={localizedPageData} />
            }
          </Col>
        </Row>
        
        <Row  isMobile={true} className="prev-row">
          <Col
            span="20"
            offset="4"
          >
            <section className="prev-next-nav">
              {
                prev ?
                  React.cloneElement(prev.props.children, { className: 'next-icon prev-page' }) :
                  null
              }
              {
                next ?
                  React.cloneElement(next.props.children, { className: 'next-icon next-page' }) :
                  null
              }
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}

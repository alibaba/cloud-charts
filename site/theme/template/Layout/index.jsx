import React, {cloneElement} from 'react';
import ReactDOM from 'react-dom';
import {addLocaleData, IntlProvider} from 'react-intl';
import enLocale from '../../en-US';
import cnLocale from '../../zh-CN';
import * as utils from '../utils';
import AiscPortalLayout from "@alife/aisc-portal-layout";
import "../../static/index.scss";
import routerCof from '../../index';

if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  // Expose to iframe
  window.react = React;
  window['react-dom'] = ReactDOM;
  /* eslint-enable global-require */
}

export default class Layout extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const pathname = props.location.pathname;
    const appLocale = utils.isEnUS(pathname) ? enLocale : cnLocale;
    addLocaleData(appLocale.data);
    this.state = {
      isFirstScreen: true,
      appLocale,
    };
  }

  componentDidMount() {
    if (typeof window.ga !== 'undefined') {
      this.context.router.listen((loc) => {
        window.ga('send', 'pageview', loc.pathname + loc.search);
      });
    }

    const nprogressHiddenStyle = document.getElementById('nprogress-style');
    if (nprogressHiddenStyle) {
      this.timer = setTimeout(() => {
        nprogressHiddenStyle.parentNode.removeChild(nprogressHiddenStyle);
      }, 0);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onEnterChange = (mode) => {
    this.setState({
      isFirstScreen: mode === 'enter',
    });
  }
  getCurrentLink(){
    let pathname=location.pathname,current="";
    routerCof.link.forEach((item)=>{
      if(pathname.replace('/'+routerCof.routes.prefix,'').split('/')[1]==item.to.split('/')[1]){
        current=item.to;
      }
    })
    return current;
  }

  render() {
    const {children, picked, ...restProps} = this.props;
    const {appLocale, isFirstScreen} = this.state;
    const components = picked.components;
    const locale = appLocale.locale;
    const isZhCN = locale === 'zh-CN';
    const excludedSuffix = isZhCN ? 'zh-CN.md' : 'en-US.md';
    const options = components
      .filter(({meta}) => meta.filename.endsWith(excludedSuffix))
      .map(({meta}) => {
        const pathSnippet = meta.filename.split('/')[1];
        const url = `/components/${pathSnippet}`;
        const subtitle = meta.subtitle || "";
        const title = meta.title || "";
        return {
          title: title,
          subtitle: subtitle,
          value: url,
        }
      });
     // console.log(options,appLocale,children, restProps)
    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <AiscPortalLayout navLink={routerCof.link} locale={appLocale.locale} searchOptions={options}
                          currentLink={this.getCurrentLink()} messages={appLocale.messages} { ...restProps}>
          {children}
        </AiscPortalLayout>
      </IntlProvider>
    );
  }
}

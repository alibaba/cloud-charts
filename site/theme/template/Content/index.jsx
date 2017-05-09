import React from 'react';
import collect from '@alife/brush/collect';
import ReactDOM from 'react-dom';
import MainContent from './MainContent';
import * as utils from '../utils';
import { routes } from '../../'

export default collect(async (nextProps) => {
  const pathname = nextProps.location.pathname;
  const locale = utils.isEnUS(pathname) ? 'en-US' : 'zh-CN';
  const pageDataPath = pathname.replace('-en', '').replace(`${routes.prefix}`,'').split('/');
  const pageData = nextProps.utils.get(nextProps.data, pageDataPath);
  if (!pageData) {
    throw 404; // eslint-disable-line no-throw-literal
  }

  const pageDataPromise = typeof pageData === 'function' ?
          pageData() : (pageData[locale] || pageData.index[locale] || pageData.index)();

  const demosFetcher = nextProps.utils.get(nextProps.data, [...pageDataPath, 'demo']);
  if (demosFetcher) {
    const [localizedPageData, demos] = await Promise.all([pageDataPromise, demosFetcher()]);
    return { localizedPageData, demos };
  }
  return { localizedPageData: await pageDataPromise };
})(MainContent);



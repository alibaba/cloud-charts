import React, { PropTypes, Children, cloneElement } from 'react';
import DocumentTitle from 'react-document-title';
import { getChildren } from 'jsonml.js/lib/utils';
import * as utils from '../utils';

export default class Article extends React.Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    const links = [...document.querySelectorAll('.outside-link.internal')];
    if (links.length === 0) {
      return;
    }
    // eslint-disable-next-line
    const checkImgUrl = 'https://g-assets.daily.taob' + 'ao.net/seajs/seajs/2.2.0/sea.js';
    this.pingTimer = utils.ping(checkImgUrl, (status) => {
      if (status !== 'timeout') {
        links.forEach(link => (link.style.display = 'block'));
      } else {
        links.forEach(link => link.parentNode.removeChild(link));
      }
    });
  }
  componentWillUnmount() {
    clearTimeout(this.pingTimer);
  }
  getArticle(article) {
    const { content } = this.props;
    const { meta } = content;
    console.log(article);
    return article;
  }
  render() {
    const props = this.props;
    const content = props.content;
    console.log(content)
    const { meta, description } = content;
    const { title, subtitle, filename } = meta;
    const locale = this.context.intl.locale;
    return (
      <DocumentTitle title={`${title[locale] || title} - AISC`}>
        <article className="markdown">
          <h1>
             <span className="subtitle">{subtitle}</span>
             {
                !title || locale === 'en-US' ? null :
                  <span className="title">{title[locale] || title}</span>
             }
          </h1>
          {
            !description ? null :
              props.utils.toReactComponent(
                ['section', { className: 'markdown' }].concat(getChildren(description))
              )
          }
          {
            (!content.toc || content.toc.length <= 1 || meta.toc === false) ? null :
              <section className="toc">{props.utils.toReactComponent(content.toc)}</section>
          }
          {
            this.getArticle(props.utils.toReactComponent(
              ['section', { className: 'markdown' }].concat(getChildren(content.content))
            ))
          }
        </article>
      </DocumentTitle>
    );
  }
}

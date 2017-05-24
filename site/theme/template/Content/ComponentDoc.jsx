import React from 'react';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import {Grid, Icon,Dropdown} from '@alife/aisc';
import {getChildren} from 'jsonml.js/lib/utils';
import Demo from './Demo';

const {Col, Row} = Grid;

export default class ComponentDoc extends React.Component {
  static contextTypes = {
    intl: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      expandAll: false,
    };
  }

  handleExpandToggle = () => {
    this.setState({
      expandAll: !this.state.expandAll,
    });
  }

  render() {
    const props = this.props;
    const {doc, location} = props;
    const {content, meta} = doc;
    const locale = this.context.intl.locale;
    const demos = Object.keys(props.demos).map(key => props.demos[key]);
    const expand = this.state.expandAll;

    const isSingleCol = meta.cols === 1;
    const leftChildren = [];
    const rightChildren = [];
    const showedDemo = demos.some(demo => demo.meta.only) ?
      demos.filter(demo => demo.meta.only) : demos.filter(demo => demo.preview);
    showedDemo.sort((a, b) => a.meta.order - b.meta.order)
      .forEach((demoData, index) => {
        if (index % 2 === 0 || isSingleCol) {
          leftChildren.push(
            <Demo {...demoData} 
                  key={demoData.meta.filename} utils={props.utils}
                  expand={expand} pathname={location.pathname}
            />
          );
        } else {
          rightChildren.push(
            <Demo {...demoData} 
                  key={demoData.meta.filename} utils={props.utils}
                  expand={expand} pathname={location.pathname}
            />
          );
        }
      });
    const expandTriggerClass = classNames({
      'code-box-expand-trigger': true,
      'code-box-expand-trigger-active': expand,
    });

    const jumper = showedDemo.map((demo) => {
      const title = demo.meta.title;
      const localizeTitle = title[locale] || title;
      return (
        <li key={demo.meta.id} title={localizeTitle}>
          <a href={`#${demo.meta.id}`}>
            {localizeTitle}
          </a>
        </li>
      );
    });

    const {title, subtitle, filename, developer, developerId,designer,designerId} = meta;
    return (
      <DocumentTitle title={`${subtitle || ''} ${title[locale] || title} - AISC`}>
        <article>
          <div className="toc-affix" ref="toc">
            <ul className="toc demos-anchor">
              {jumper}
            </ul>
          </div>
          <section className="markdown left">
            <h1>
              {title[locale] || title}
              {
                !subtitle ? null :
                  <span className="subtitle">{subtitle}</span>
              }
            </h1>
            <div>
              {
                developerId&&developer?
                <a target="_blank" key={developerId} href={"http://work.alibaba-inc.com/nwpipe/u/" + developerId}>{"开发负责人:" + developer}</a>:[]
              }
              <span className={designerId&&designer ? "designer-text":""}>
                {
                  designerId&&designer?
                    <a target="_blank" key={designerId} href={"http://work.alibaba-inc.com/nwpipe/u/" + designerId}>{"设计师:" + designer}</a>:[]
                }
              </span>
            </div>
            {
              props.utils.toReactComponent(
                ['section', {className: 'markdown'}]
                  .concat(getChildren(content))
              )
            }
            <h2>
              {/*<Icon type="view" className={expandTriggerClass}
               title="展开全部代码" onClick={this.handleExpandToggle}
               />*/}
            </h2>
          </section>
          <Row className="code-container" type="no-padding" isMobile={true}>
            <Col span={isSingleCol ? '24' : '12'}
                 className={isSingleCol ?
                   'code-boxes-col-1-1' :
                   'code-boxes-col-2-1'
                 }
            >
              {leftChildren}
            </Col>
            {
              isSingleCol ? null :
                <Col className="code-boxes-col-2-1" span="12">{rightChildren}</Col>
            }
            
          </Row>
          {
            props.utils.toReactComponent(
              ['section', {
                className: 'markdown api-container',
              }].concat(getChildren(doc.api || ['placeholder']))
            )
          }
        </article>
      </DocumentTitle>
    );
  }
}

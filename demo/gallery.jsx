/*
 * 代理 gallery 页面开发页
 *
 * 线上需要配置代理 aisc.alibaba-inc.com/packages/page95.js  =>  localhost:9009/demo/gallery.js
 *
 * */
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Icon } from '@alife/aisc';
import { COLORS } from '@alife/aisc-widgets';
// 如果要在该页面代理本地 Widgets 版本，或者在localhost中查看本页面，则解注释下面两行代码
// import * as Widgets from '@alife/aisc-widgets';
// window.AiscWidgets = Widgets;

const { Row, Col } = Grid;

class Demo extends React.Component {
  state = {
    pageList: [],
  };

  componentDidMount() {
    let pageList = [];
    fetch('/api/category/getSideMenuById?_input_charset=utf-8&id=4')
      .then(res => res.json())
      .then((res) => {
        pageList = res.result.categories[1].pages.map(p => ({ name: p.name, id: p.id }));

        const detailList = pageList.map((page) =>{
          return fetch(`/api/page/getDetailById?_input_charset=utf-8&id=${page.id}`).then(res => res.json());
        });

        return Promise.all(detailList);
      })
      .then((details) => {
        details.forEach((detail, i) => {
          pageList[i].examples = detail.result.examples.map(e => ({
            name: e.name,
            id: e.id,
            description: e.description,
            js: e.compiledHightLightJs,
            css: e.css,
          }));
        });

        pageList.forEach((page) => {
          page.examples.forEach((example) => {
            const script = document.createElement("script");
            script.src = `/packages/example${example.id}.js`;
            script.async = true;
            document.body.appendChild(script);
          });
        });

        this.setState({
          pageList: pageList,
        });
      });

    const link = document.createElement("link");
    link.href = `http://localhost:9009/demo/gallery.css`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  render() {
    const { pageList } = this.state;
    return (
      <div>
        {
          pageList.map((page) =>{
            return (
              <div key={page.id}>
                <h2>
                  {page.name}
                  <a className="chart-list-item-title-link" href={`/site/pc#/cate/4/page/${page.id}`} title="详情"><Icon type="arrow-right" size="small" /></a>
                </h2>
                <Row type={['wrap', 'no-padding']} gutter={20}>
                  {
                    page.examples.map((example) => {
                      return (
                        <Col key={example.id} span={8} style={{ minHeight: 200 }}>
                          <Card {...example} pageId={page.id} />
                        </Col>
                      );
                    })
                  }
                </Row>
              </div>
            );
          })
        }
      </div>
    );
  }
}

class Card extends React.Component {
  state = {
    // view: 图表展示，js: 脚本代码，css: 样式代码
    show: 'view',
  };

  render() {
    const { pageId, id, name, description, js, css } = this.props;

    return (
      <div className="chart-list-item" style={{ marginBottom: 20, background: COLORS.widgetsContainerBackground }}>
        <div className="chart-list-item-title" style={{ paddingLeft: 20, height: 32, lineHeight: '32px' }}>
          {name}
          <a className="chart-list-item-title-link" href={`/site/pc#/cate/4/page/${pageId}/example/${id}`} title="详情"><Icon type="arrow-right" size="small" /></a>

        </div>
        <div id={`aisc-example-preview-${id}`} />
      </div>
    );
  }
}

// widgets-gallery 这个 id 名需要和后台中配置的 dom id 一致
ReactDOM.render(<Demo />, document.getElementById('widgets-gallery'));
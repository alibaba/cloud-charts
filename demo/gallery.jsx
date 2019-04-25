/*
 * 代理 gallery 页面开发页
 *
 * 线上需要配置代理 aisc.alibaba-inc.com/packages/page95.js  =>  localhost:9009/demo/gallery.js
 *
 * */
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Icon, Tab } from '@alife/aisc';
// 如果要在该页面代理本地 Widgets 版本，或者在localhost中查看本页面，则解注释下面两行代码
// import * as Widgets from '@alife/aisc-widgets';
// window.AiscWidgets = Widgets;
// 否则使用下面这一行
const { COLORS } = window.AiscWidgets;


const { Row, Col } = Grid;
const TabPane = Tab.TabPane;

class Demo extends React.Component {
  state = {
    pageList: [],
    active: ""
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
        // 记录example个数
        let index = 0;
        details.forEach((detail, i) => {
          pageList[i].examples = detail.result.examples.map((e) => {
            index += 1;
            return {
              name: e.name,
              id: e.id,
              description: e.description,
              js: e.compiledHightLightJs,
              css: e.css,
              riddleId: e.riddleId,
              index: index,
            };
          });
        });

        this.setState({
          pageList: pageList,
        });
      });

    // 下面这块用于注入代理时的css
    const link = document.createElement("link");
    link.href = `http://localhost:9009/demo/gallery.css`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  toView(page){
    let dom  = document.querySelector(`#page-${page.id}`);
    dom.scrollIntoView();
    this.setState({
      active: page.id
    })
  }

  render() {
    const { pageList, active } = this.state;
    return (
      <div>
        <div className="chart-layout-out">
          {
            pageList.map(page => (
              <span onClick={() => this.toView(page)} className={`chart-link-tab ${active == page.id ? "active" : ""}`}>{page.name}</span>
            ))
          }
        </div>
        {
          pageList.map((page, pageIndex) =>{
            return (
              <div key={page.id}>
                <div className="page-title">
                  <div className="view-top-tag" id={`page-${page.id}`} />
                  {page.name}
                  <a className="chart-list-item-title-link" href={`/site/pc#/cate/4/page/${page.id}`} title="详情"><Icon type="arrow-right" size="small" /></a>
                </div>
                <PageChart examples={page.examples} pageId={page.id} pageIndex={pageIndex} />
              </div>
            );
          })
        }
      </div>
    );
  }
}

const pageChartStyle = `
body {
  background: transparent;
}
#widgets-gallery {
  overflow: hidden;
}
.chart-list-item {
  margin-bottom: 20px;
}
.chart-list-item-title {
  position: relative;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
}
.chart-list-item-tab .next-tabs-content {
  padding: 0;
}
.chart-list-item-tab .next-tabs-tabpane {
  height: 320px;
}
.chart-list-item-tab pre {
  margin: 0;
  padding: 20px;
  width: 100%;
  height: 100%;
}
.chart-list-item-tab-link {
  margin-right: 20px;
  line-height: 40px;
}
`;

class PageChart extends React.Component {
  componentDidMount() {
    if (this.frame) {
      const contentDocument = this.frame.contentDocument;

      // 注入 Aisc & AiscWidgets 样式
      const links = document.querySelectorAll('link');
      Array.prototype.forEach.call(links, (link) => {
        if (link.href.indexOf('aisc/aisc/') > -1 || link.href.indexOf('aisc/aisc-widgets/') > -1) {
          const css = contentDocument.createElement('link');
          css.href = link.href;
          css.rel = 'stylesheet';
          contentDocument.head.appendChild(css);
        }
      });

      // 注入内容块样式
      const style = contentDocument.createElement('style');
      style.innerText = pageChartStyle;
      contentDocument.head.appendChild(style);

      // 注入依赖库
      this.frame.contentWindow.React = window.React;
      this.frame.contentWindow.ReactDOM = window.ReactDOM;
      this.frame.contentWindow.Aisc = window.Aisc;
      this.frame.contentWindow.AiscWidgets = window.AiscWidgets;

      this.frame.contentWindow.Examples = this.renderExamples();

      // 创建脚本内容
      const div = contentDocument.createElement('div');
      div.id = 'widgets-gallery';
      contentDocument.body.appendChild(div);

      const script = contentDocument.createElement('script');
      script.innerText = `ReactDOM.render(window.Examples, document.getElementById('widgets-gallery'))`;
      contentDocument.body.appendChild(script);
    }
  }

  renderExamples() {
    const { examples, pageId, pageIndex } = this.props;

    return (
      <Row type={['wrap', 'no-padding']} gutter={20}>
        {
          examples.map((example) => {
            return (
              <Col key={example.id} span={8} style={{ minHeight: 200 }}>
                <Card {...example} pageId={pageId} pageIndex={pageIndex} />
              </Col>
            );
          })
        }
      </Row>
    );
  }

  render() {
    const { examples, pageId } = this.props;

    return <iframe
      name={`page-gallery-${pageId}`}
      className="chart-frame"
      ref={f => (this.frame = f)}
      seamless
      src="about:blank"
      style={{ height: Math.ceil(examples.length / 3) * 415 }}
    />;
  }
}

class Card extends React.Component {
  componentDidMount() {
    const { pageId, id, index, pageIndex } = this.props;
    let doc = document;
    if (window.frames && window.frames[`page-gallery-${pageId}`]) {
      doc = window.frames[`page-gallery-${pageId}`].document;
    }
    setTimeout(() =>{
      const script = doc.createElement("script");
      script.src = `/packages/example${id}.js`;
      script.async = true;
      doc.body.appendChild(script);
    }, Math.round(index * 50 + pageIndex * 100));
  }

  render() {
    const { pageId, id, name, description, js, css, riddleId } = this.props;

    return (
      <div className="chart-list-item">
        <div className="chart-list-item-title">
          {name}
        </div>
        <Tab
          className="chart-list-item-tab"
          style={{ background: COLORS.widgetsContainerBackground }}
          tabBarExtraContent={
            <a className="chart-list-item-tab-link" href={`/site/pc#/cate/4/page/${pageId}/example/${id}`}>文档</a>
          }
        >
          <TabPane key="chart" tab="图表">
            <div id={`aisc-example-preview-${id}`} />
          </TabPane>
          <TabPane key="js" tab="代码">
            <pre>
              <code>{js}</code>
            </pre>
          </TabPane>
        </Tab>
      </div>
    );
  }
}

// widgets-gallery 这个 id 名需要和后台中配置的 dom id 一致
ReactDOM.render(<Demo />, document.getElementById('widgets-gallery'));
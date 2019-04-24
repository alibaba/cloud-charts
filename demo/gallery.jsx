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
        details.forEach((detail, i) => {
          pageList[i].examples = detail.result.examples.map(e => ({
            name: e.name,
            id: e.id,
            description: e.description,
            js: e.compiledHightLightJs,
            css: e.css,
            riddleId: e.riddleId,
          }));
        });

        // pageList.forEach((page) => {
        //   page.examples.forEach((example) => {
        //     const script = document.createElement("script");
        //     script.src = `/packages/example${example.id}.js`;
        //     script.async = true;
        //     document.body.appendChild(script);
        //   });
        // });

        this.setState({
          pageList: pageList,
        });
      });

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
          pageList.map((page) =>{
            return (
              <div key={page.id}>
                <div className="page-title">
                  <div className="view-top-tag" id={`page-${page.id}`} />
                  {page.name}
                  <a className="chart-list-item-title-link" href={`/site/pc#/cate/4/page/${page.id}`} title="详情"><Icon type="arrow-right" size="small" /></a>
                </div>
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

  componentDidMount() {
    if (this.frame) {
      const { id, css } = this.props;
      const jsUrl = `/packages/example${id}.js`;
      const domId = `aisc-example-preview-${id}`;

      const contentDocument = this.frame.contentDocument;

      // 处理样式
      const links = document.querySelectorAll('link');
      Array.prototype.forEach.call(links, (link) => {
        if (link.href.indexOf('aisc/aisc/') > -1 || link.href.indexOf('aisc/aisc-widgets/') > -1) {
          const css = contentDocument.createElement('link');
          css.href = link.href;
          css.rel = 'stylesheet';
          contentDocument.head.appendChild(css);
        }
      });

      // 数据中可能存在的自定义css
      if (css) {
        console.log(this.props.name, css)
        const style = contentDocument.createElement('style');
        style.innerText = css;
        contentDocument.head.appendChild(style);
      }

      // 创建脚本内容
      const div = contentDocument.createElement('div');
      div.id = domId;
      contentDocument.body.appendChild(div);

      const script = contentDocument.createElement('script');
      script.src = jsUrl;
      script.async = true;
      contentDocument.body.appendChild(script);

      // 注入依赖库
      this.frame.contentWindow.React = window.React;
      this.frame.contentWindow.ReactDOM = window.ReactDOM;
      this.frame.contentWindow.Aisc = window.Aisc;
      this.frame.contentWindow.AiscWidgets = window.AiscWidgets;
    }
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
            <iframe className="chart-frame" ref={f => (this.frame = f)} seamless src="about:blank" />
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
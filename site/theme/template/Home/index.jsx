import React from 'react';
import { injectIntl } from 'react-intl';
import { Slider, Grid, Button } from '@alife/aisc';
import SliderHome from './slider.jsx';
import {FormattedMessage} from 'react-intl';
const { Row, Col } = Grid;

function Home(props) {
  // 定义首页banner图片src
  const IMAGE_DATA = [
    {
      src: 'https://img.alicdn.com/tps/TB134OfPpXXXXaFXXXXXXXXXXXX-750-450.jpg',
      alt: 'images-1',
    },
    {
      src: 'https://img.alicdn.com/tps/TB1hx9IPpXXXXXCXXXXXXXXXXXX-750-450.jpg',
      alt: 'images-2',
    },
    {
      src: 'https://img.alicdn.com/tps/TB1VdKiPpXXXXb3XVXXXXXXXXXX-750-450.jpg',
      alt: 'images-3',
    }
  ];

  return (<div className="layout">
      <Slider
        pauseOnHover="true"
        slideDirection="vertical"
        dotsClass="dotpadding"
        dotsDirection="vertical"
        slidesToShow={1}
        adaptiveHeight
        slidesToScroll={1}
        dots
        arrows={false}
        autoplay={false}
        autoplaySpeed={1000}
      >

        <div key={1}>
          <div className="page three-page">
            <Row>
              <Col span="14" fixedOffset="2">
                <div className="min-slide">
                  <SliderHome
                    items={IMAGE_DATA}
                    speed={1}
                    delay={2}
                    pause
                    autoplay
                    dots
                    arrows
                  />
                </div>
              </Col>
              <Col span="8" fixedOffset="1">
                <div className="three-page-text">
                  <h3> <FormattedMessage
                    id="app.header.lang"
                /></h3>
                  <p>AISC已支撑了IDC运营平台、合同计费、iClone装机系统、CloudDBA、starAgent、PIPA、EC巡检等基石系列项目</p>
                  {/*<Button type="primary">VIEW DEMO</Button>*/}
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div key={2}>
          <div className="page one-page">
            <h3>专注Web端UI解决方案</h3>
            <p>AISC是一套给予React前端UI解决方案、专注解决AIS自身业务的组件库</p>
          </div>
        </div>
        <div key={3}>
          <div className="page two-page">
            <h3>注重产品体验、提升视觉美感</h3>
            <p>凝聚AIS—UED设计团队和交互设计的力量、注重产品体验的同时提升产品视觉美感</p>
          </div>
        </div>
      </Slider>
    </div>);
}

export default injectIntl(Home);

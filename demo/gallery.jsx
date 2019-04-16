import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import classnames from 'classnames';
import { Grid } from '@alife/aisc';
import * as Widgets from '@alife/aisc-widgets';

const { Row, Col } = Grid;

class Demo extends React.Component {

  state = {
  };

  componentDidMount() {
  }

  render() {
    const {  } = this.state;
    return (
      <Row>
        <Col fixedSpan="16">

        </Col>
        <Col style={{ background: Widgets.COLORS.widgetsContainerBackground }}>
        </Col>
      </Row>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Demo />
    </AppContainer>,
    document.getElementById('container')
  )
};

render();

if (module.hot) {
  module.hot.accept( () => { render() })
}

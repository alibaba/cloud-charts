import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import classnames from 'classnames';
import { Grid } from '@alife/aisc';
import WorldMap from '@alife/aisc-widgets/plugins/worldmap';

const { Row, Col } = Grid;

class Demo extends React.Component {
  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <div className="map-demo">
        <WorldMap />
      </div>
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

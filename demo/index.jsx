import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as Widgets from '@alife/aisc-widgets';

class Demo extends React.Component {
  render() {
    return (
      <div>23333</div>
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

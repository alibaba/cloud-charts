import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as Widgets from '@alife/aisc-widgets';

class Demo extends React.Component {

  state={
    wdashboardData:0
  }

  componentDidMount(){
    setInterval(()=>{
      this.setState({
        wdashboardData: 100*Math.random()
      })
    },1000)
  }

  render() {
    return (
      <div>
        <Widgets.Wdashboard  data={this.state.wdashboardData}/>
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

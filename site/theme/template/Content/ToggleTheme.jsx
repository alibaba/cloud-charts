import React from 'react';
import ReactDOM from 'react-dom';
import { Select } from '@alife/aisc';
import classNames from 'classnames';

const { Option } = Select;

export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: 'aisc',
    };
  }

  onSelect(value) {
    const style = document.getElementById('themeStyle')
    const body = document.getElementsByTagName('body')[0]
    const root = body.getAttribute('root')
    const url = `${root}${value}.css`
    style.setAttribute('href',url)
    this.setState({
      theme: value
    })
  }

  render() {
    const { theme } = this.state;
    
    return (
    <div className="themeSelect">
     <span className="themeText">主题: </span>
     <Select onChange={this.onSelect.bind(this)}  placeholder="选择主题" value={this.state.theme}>
        <Option value="aisc">Aisc</Option>
        <Option value="aone">Aone</Option>
     </Select>
     </div>
    );
  }
}

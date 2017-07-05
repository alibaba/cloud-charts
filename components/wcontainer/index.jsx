'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Grid } from '@alife/aisc';

import Divider from './views/divider';
import './index.scss';

const { Row, Col } = Grid;
const prefix = 'aisc-wcontainer'

export default class Wcontainer extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTitle() {
    return (
      <div className={`${prefix}-title`}>
          {this.props.title}
          <span className={`${prefix}-time`}>
          </span>
      </div>
    );
  }

  render() {
    let { height = 0, d } = this.props;
    const styleObj = {
      'min-height': height + 'px',
    };

    const containerClasses = classNames({
      [`${prefix}-main`]: true,
    })


    return (
      <div className={`${prefix}`} style={styleObj}>
        {this.props.title && this.renderTitle()}
        <div className={containerClasses}>
           <Row align="center">
            {
              React.Children.map(this.props.children, (child, i) => {
                if (child.type.name === 'Wicon') {
                  return <Col fixedSpan="2">{child}</Col>
                }
                if (child.type.name === 'Divider') {
                  return <Col fixedSpan="1">{child}</Col>
                }
                return (
                  <Col>{child}</Col>
                )
              })
            }
           </Row>
        </div>
      </div>
    );
  }
}

Wcontainer.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
}

Wcontainer.divider = Divider;

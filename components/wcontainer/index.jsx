'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@alife/aisc';
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
    let { height=0 } = this.props;
    const styleObj = {
      'min-height': height + 'px',
    };


    return (
      <div className={`${prefix}`} style={styleObj}>
        {this.props.title && this.renderTitle()}
        <div className={`${prefix}-main`}>
           <Row align="center">
            {
              React.Children.map(this.props.children, (child, i) => {
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


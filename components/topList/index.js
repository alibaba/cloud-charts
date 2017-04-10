'use strict';

import React from 'react';
import './index.scss';

function emptyRender(v) {
  return v;
}

class List extends React.Component {
  state = {
    domData: []
  };

  normalizeChildren(props) {

    const domData = React.Children.map(props.children, (child) => {
      const result = {
        columns: [],
        // sortIndex: null
      };
      console.log(child)

      const keys = [];
      let sortIndex;
      let sortFunc;
      React.Children.forEach(child.props.children, (column) => {
        //获取dataIndex
        const dataIndex = column.props.dataIndex;
        if (dataIndex) {
          keys.push(dataIndex);
        }

        //获取排序相关规则
        if (column.props.sortable) {
          sortIndex = column.props.dataIndex
        }
        if (column.props.sort) {
          sortFunc = column.props.sort;
        }

        result.columns.push({
          ...column.props
        })
      });

      {/*复制数据*/}
      let newData = props.dataSource.map((d) => {
        const res = {};
        keys.forEach((key) => {
          res[key] = d[key];
        });
        return res;
      });

      //排序
      if (sortIndex) {
        if (!sortFunc) {
          sortFunc = (a, b) => {
            return a[sortIndex] - b[sortIndex]
          }
        }
        newData.sort(sortFunc);
      }

      //截取固定长度
      const topLimit = this.props.topLimit || 10;
      newData = newData.slice(0, topLimit);

      result.dataSource = newData;
      result.sortIndex = sortIndex;

      return result;
    });

    console.log(domData);
    this.setState({
      domData: domData || []
    });
  }

  componentWillMount() {
    this.normalizeChildren(this.props);
  }

  renderCell(column, data) {
    const cell = column.cell || emptyRender;

    return data.map((d, i) => {
      const value = column.dataIndex ? d[column.dataIndex] : d;
      const cellCls = i < 3 ? 'top-list-column-cell-color' : '';
      return (
        <div className={`top-list-column-cell ${cellCls}`} key={i}>
          {cell(value, i, d)}
        </div>
      );
    });
  }

  render() {
    return (
      <div className="top-list">
        <div className="title">{this.props.title}</div>
        <div className="content">
          {
            this.state.domData.map((item, itemIndex) => {
              return (
                <div className="top-list-item" key={itemIndex}>
                  {
                    item.columns.map((column, colIndex) => {
                      const sortCls =
                        (column.sortable && column.dataIndex === item.sortIndex) ?
                          'top-list-column-sort' : '';
                      return (
                        <div className={`top-list-column ${sortCls}`} key={colIndex}>
                          <div className="top-list-column-title">{column.title}</div>
                          {this.renderCell(column, item.dataSource)}
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

class Item extends React.Component {
  render() {
    return (
      <div className="top-list-item">
        {
          React.Children.map(this.props.children, (child) => {
            child.props.dataSource = this.props.dataSource;
            return child;
          })
        }
      </div>
    );
  }
}

class Column extends React.Component {
  renderContent() {
    let data = this.props.dataSource || [];
    if (this.props.sortable) {
      data.sort(this.props.sort || undefined);
    }

    const topLimit = this.props.topLimit || 10;
    data = data.slice(0, topLimit);

    return data.map((d, i) => {
      const value = this.props.dataIndex ? d[this.props.dataIndex] : d;
      return (
        <div className="top-list-item-column-cell" key={i}>
          {this.props.cell(value, i, d) || emptyRender(value)}
        </div>
      );
    });
  }

  render() {
    return (
      <div className="top-list-item-column">
        <div className="title">{this.props.title}</div>
        {this.renderContent()}
        <div className="content"></div>
      </div>
    );
  }
}

Item.Column = Column;

List.Item = Item;

export default List;
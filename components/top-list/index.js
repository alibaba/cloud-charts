'use strict';

import React from 'react';
import classnames from 'classnames';
import './index.scss';

function emptyRender(v) {
  return v;
}

const alignTypes = {
  left: true,
  center: true,
  right: true
};

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      domData: [],
      activeKey: props.activeKey || ''
    };
  }

  //点击顶部tab
  handleTabClick(group, isActive, e) {
    if (isActive) {
      return;
    }

    this.setState({
      activeKey: group.tabKey
    });
  }

  handleRowHover(record, index, groupIndex, isEnter) {
    const domData = this.state.domData;
    record['isHover'] = !!isEnter;
    domData[groupIndex].dataSource[index] = record;
    this.setState({
      domData: domData || []
    });
  }

  //计算组件所需要的数据
  normalizeChildren(props) {
    const domData = React.Children.map(props.children, (child) => {
      const result = {
        title: child.props.title || '',
        width: child.props.width,
        align: child.props.align,
        tabKey: child.props.tabKey || child.props.title || '',
        columns: [],
        // sortIndex: null
      };

      const dataSource = child.props.dataSource || props.dataSource || [];

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
      let newData = dataSource.map((d) => {
        const res = {};
        keys.forEach((key) => {
          res[key] = d[key];
        });
        return res;
      });

      //排序
      if (sortIndex) {
        if (!sortFunc) {
          //默认降序排列
          sortFunc = (a, b) => {
            return b[sortIndex] - a[sortIndex]
          }
        }
        newData.sort(sortFunc);
      }

      //截取固定长度
      const topLimit = props.topLimit || 10;
      newData = newData.slice(0, topLimit);

      result.dataSource = newData;
      result.sortIndex = sortIndex;

      return result;
    });

    this.setState({
      domData: domData || []
    });
  }

  componentWillMount() {
    this.normalizeChildren(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.normalizeChildren(nextProps);
  }

  //渲染单元格
  renderCell(column, data, sortable, groupIndex) {
    const cell = column.cell || emptyRender;

    return data.map((d, i) => {
      const value = column.dataIndex ? d[column.dataIndex] : d;
      const cellCls = classnames('top-list-column-cell', {
        'top-list-column-cell-color': i < 3 && sortable,
        'top-list-column-cell-hover': d.isHover
      });
      return (
        <div className={cellCls} key={i}
             onMouseEnter={this.handleRowHover.bind(this, d, i, groupIndex, true)}
             onMouseLeave={this.handleRowHover.bind(this, d, i, groupIndex, false)}>
          {cell(value, i, d)}
        </div>
      );
    });
  }

  //渲染组
  renderGroup = (group, groupIndex) => {
    const groupAlignCls = (group.align && alignTypes[group.align]) ? `top-list-align-${group.align}` : '';
    const groupStyle = {};
    if (group.width) {
      groupStyle.width = group.width;
    }
    const groupCls = classnames('top-list-group', {
      'top-list-fix-width': group.width,
    }, groupAlignCls);
    return (
      <div className={groupCls} style={groupStyle} key={groupIndex}>
        {
          group.columns.map((column, colIndex) => {
            const isSort = column.sortable && column.dataIndex === group.sortIndex;
            const columnAlignCls = (column.align && alignTypes[column.align]) ? `top-list-align-${column.align}` : '';
            const columnStyle = {};
            if (column.width) {
              columnStyle.width = column.width;
            }
            const columnCls = classnames('top-list-column', {
              'top-list-fix-width': column.width,
              'top-list-column-sort': isSort
            }, columnAlignCls);
            return (
              <div className={columnCls} style={columnStyle} key={colIndex}>
                <div className="top-list-column-title">{column.title}</div>
                {this.renderCell(column, group.dataSource, isSort, groupIndex)}
              </div>
            );
          })
        }
      </div>
    );
  };

  render() {
    //顶部标题样式
    const alignCls = (this.props.titleAlign && alignTypes[this.props.titleAlign]) ? `top-list-align-${this.props.titleAlign}` : '';
    const titleCls = classnames('top-list-title', alignCls);

    if (this.props.tabMode) {
      //Tab模式
      return (
        <div className="top-list">
          <div className="top-list-header">
            <div className={titleCls}>{this.props.title}</div>
            {
              this.state.domData.map((group, i) => {
                const isActive = group.tabKey === this.state.activeKey || !this.state.activeKey && i === 0;
                const tabCls = classnames('top-list-tab-key', {
                  'active': isActive
                });
                return (
                  <div className={tabCls} key={i} onClick={this.handleTabClick.bind(this, group, isActive)}>{group.title}</div>
                );
              })
            }
          </div>
          <div className="top-list-content">
            {
              this.state.domData.filter((group, i) => {
                return group.tabKey === this.state.activeKey || !this.state.activeKey && i === 0;
              }).map(this.renderGroup)
            }
          </div>
        </div>
      );
    } else {
      //平铺模式
      return (
        <div className="top-list">
          <div className="top-list-header">
            <div className={titleCls}>{this.props.title}</div>
          </div>
          <div className="top-list-content">
            {
              this.state.domData.map(this.renderGroup)
            }
          </div>
        </div>
      );
    }
  }
}

class Group extends React.Component {
  render() {
    return null;
  }
}

class Column extends React.Component {
  render() {
    return null;
  }
}

Group.Column = Column;

List.Group = Group;

export default List;

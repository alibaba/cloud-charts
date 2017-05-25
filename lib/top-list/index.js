'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function emptyRender(v) {
  return v;
}

var alignTypes = {
  left: true,
  center: true,
  right: true
};

var List = function (_React$Component) {
  _inherits(List, _React$Component);

  function List(props) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _this.renderGroup = function (group, groupIndex) {
      var groupAlignCls = group.align && alignTypes[group.align] ? 'top-list-align-' + group.align : '';
      var groupStyle = {};
      if (group.width) {
        groupStyle.width = group.width;
      }
      var groupCls = (0, _classnames2.default)('top-list-group', {
        'top-list-fix-width': group.width
      }, groupAlignCls);
      return _react2.default.createElement(
        'div',
        { className: groupCls, style: groupStyle, key: groupIndex },
        group.columns.map(function (column, colIndex) {
          var isSort = column.sortable && column.dataIndex === group.sortIndex;
          var columnAlignCls = column.align && alignTypes[column.align] ? 'top-list-align-' + column.align : '';
          var columnStyle = {};
          if (column.width) {
            columnStyle.width = column.width;
          }
          var columnCls = (0, _classnames2.default)('top-list-column', {
            'top-list-fix-width': column.width,
            'top-list-column-sort': isSort
          }, columnAlignCls);
          return _react2.default.createElement(
            'div',
            { className: columnCls, style: columnStyle, key: colIndex },
            _react2.default.createElement(
              'div',
              { className: 'top-list-column-title' },
              column.title
            ),
            _this.renderCell(column, group.dataSource, isSort, groupIndex)
          );
        })
      );
    };

    _this.state = {
      domData: [],
      activeKey: props.activeKey || ''
    };
    return _this;
  }

  //点击顶部tab


  _createClass(List, [{
    key: 'handleTabClick',
    value: function handleTabClick(group, isActive, e) {
      if (isActive) {
        return;
      }

      this.setState({
        activeKey: group.tabKey
      });
    }
  }, {
    key: 'handleRowHover',
    value: function handleRowHover(record, index, groupIndex, isEnter) {
      var domData = this.state.domData;
      record['isHover'] = !!isEnter;
      domData[groupIndex].dataSource[index] = record;
      this.setState({
        domData: domData || []
      });
    }

    //计算组件所需要的数据

  }, {
    key: 'normalizeChildren',
    value: function normalizeChildren(props) {
      var domData = _react2.default.Children.map(props.children, function (child) {
        var result = {
          title: child.props.title || '',
          width: child.props.width,
          align: child.props.align,
          tabKey: child.props.tabKey || child.props.title || '',
          columns: []
        };

        var dataSource = child.props.dataSource || props.dataSource || [];

        var keys = [];
        var sortIndex = void 0;
        var sortFunc = void 0;
        _react2.default.Children.forEach(child.props.children, function (column) {
          //获取dataIndex
          var dataIndex = column.props.dataIndex;
          if (dataIndex) {
            keys.push(dataIndex);
          }

          //获取排序相关规则
          if (column.props.sortable) {
            sortIndex = column.props.dataIndex;
          }
          if (column.props.sort) {
            sortFunc = column.props.sort;
          }

          result.columns.push(_extends({}, column.props));
        });

        {/*复制数据*/}
        var newData = dataSource.map(function (d) {
          var res = {};
          keys.forEach(function (key) {
            res[key] = d[key];
          });
          return res;
        });

        //排序
        if (sortIndex) {
          if (!sortFunc) {
            //默认降序排列
            sortFunc = function sortFunc(a, b) {
              return b[sortIndex] - a[sortIndex];
            };
          }
          newData.sort(sortFunc);
        }

        //截取固定长度
        var topLimit = props.topLimit || 10;
        newData = newData.slice(0, topLimit);

        result.dataSource = newData;
        result.sortIndex = sortIndex;

        return result;
      });

      this.setState({
        domData: domData || []
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.normalizeChildren(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.normalizeChildren(nextProps);
    }

    //渲染单元格

  }, {
    key: 'renderCell',
    value: function renderCell(column, data, sortable, groupIndex) {
      var _this2 = this;

      var cell = column.cell || emptyRender;

      return data.map(function (d, i) {
        var value = column.dataIndex ? d[column.dataIndex] : d;
        var cellCls = (0, _classnames2.default)('top-list-column-cell', {
          'top-list-column-cell-color': i < 3 && sortable,
          'top-list-column-cell-hover': d.isHover
        });
        return _react2.default.createElement(
          'div',
          { className: cellCls, key: i,
            onMouseEnter: _this2.handleRowHover.bind(_this2, d, i, groupIndex, true),
            onMouseLeave: _this2.handleRowHover.bind(_this2, d, i, groupIndex, false) },
          cell(value, i, d)
        );
      });
    }

    //渲染组

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      //顶部标题样式
      var alignCls = this.props.titleAlign && alignTypes[this.props.titleAlign] ? 'top-list-align-' + this.props.titleAlign : '';
      var titleCls = (0, _classnames2.default)('top-list-title', alignCls);

      if (this.props.tabMode) {
        //Tab模式
        return _react2.default.createElement(
          'div',
          { className: 'top-list' },
          _react2.default.createElement(
            'div',
            { className: 'top-list-header' },
            _react2.default.createElement(
              'div',
              { className: titleCls },
              this.props.title
            ),
            this.state.domData.map(function (group, i) {
              var isActive = group.tabKey === _this3.state.activeKey || !_this3.state.activeKey && i === 0;
              var tabCls = (0, _classnames2.default)('top-list-tab-key', {
                'active': isActive
              });
              return _react2.default.createElement(
                'div',
                { className: tabCls, key: i, onClick: _this3.handleTabClick.bind(_this3, group, isActive) },
                group.title
              );
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'top-list-content' },
            this.state.domData.filter(function (group, i) {
              return group.tabKey === _this3.state.activeKey || !_this3.state.activeKey && i === 0;
            }).map(this.renderGroup)
          )
        );
      } else {
        //平铺模式
        return _react2.default.createElement(
          'div',
          { className: 'top-list' },
          _react2.default.createElement(
            'div',
            { className: 'top-list-header' },
            _react2.default.createElement(
              'div',
              { className: titleCls },
              this.props.title
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'top-list-content' },
            this.state.domData.map(this.renderGroup)
          )
        );
      }
    }
  }]);

  return List;
}(_react2.default.Component);

List.displayName = 'List';

var Group = function (_React$Component2) {
  _inherits(Group, _React$Component2);

  function Group() {
    _classCallCheck(this, Group);

    return _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).apply(this, arguments));
  }

  _createClass(Group, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Group;
}(_react2.default.Component);

Group.displayName = 'Group';

var Column = function (_React$Component3) {
  _inherits(Column, _React$Component3);

  function Column() {
    _classCallCheck(this, Column);

    return _possibleConstructorReturn(this, (Column.__proto__ || Object.getPrototypeOf(Column)).apply(this, arguments));
  }

  _createClass(Column, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Column;
}(_react2.default.Component);

Column.displayName = 'Column';


Group.Column = Column;

List.Group = Group;

exports.default = List;
module.exports = exports['default'];
# 代码贡献

有任何疑问，欢迎提交 [Issues](https://github.com/alibaba/cloud-charts/issues) ，或者直接提交 [PR](https://github.com/alibaba/cloud-charts/pulls) !

## 提交 issue

1. 请确定 issue 的类型。

2. 请避免提交重复的 issue，在提交之前搜索现有的 issue。
  
3.在标签(分类参考标签分类), 标题 或者内容中体现明确的意图。
  
随后负责人会确认 issue 意图，更新合适的标签，关联 milestone，指派开发者。

## 提交代码

推荐通过 Pull Request 方式提交代码。我们会 review 代码并合并到发布分支。

为了后期回溯历史的方便，请在提交 PR 时确保提供了以下信息。

- 需求点（一般关联 issue 或者注释都算）
- 升级原因（不同于 issue，可以简要描述下为什么要修改）
- 关注点（针对用户而言，可以没有，一般是不兼容更新等，需要额外提示）


### 本地开发

```bash
# 安装依赖
$ npm install

# 使用 storybook 调试开发
npm run storybook
```

### 代码风格

你的代码风格必须通过 eslint，你可以运行 `$ npm run lint` 本地测试。

### commit 规范

根据 [Angular规范](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format) 提交 commit， 这样 history 看起来更加清晰，还可以自动生成 changelog。

```xml
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### (1) type

提交 commit 的类型，包括以下几种

- feat: 新功能
- fix: 修复问题
- docs: 修改文档
- style: 修改代码格式，不影响代码逻辑
- refactor: 重构代码，理论上不影响现有功能
- perf: 提升性能
- test: 增加修改测试用例
- chore: 修改工具相关（包括但不限于文档、代码生成等）
- deps: 升级依赖

#### (2) scope 可选

修改文件的范围

#### (3) subject

用一句话清楚的描述这次提交做了什么

#### (4) body 可选

补充 subject，适当增加原因、目的等相关因素。

#### (5) footer 可选

**当有非兼容修改(Breaking Change)时必须在这里描述清楚**

关联相关 issue，如 `Closes #1, Closes #2, #3`

示例

```text
fix(chart): 某些浏览器中的问题

由于xxx原因，在某些浏览器中出现问题

closes #1
```

### PR 贡献者必须签署 CLA 协议

在提交 PR 以后会出现一个 CLA 协议让提交者签署，未签署 CLA 协议的 PR 不会被合并。

## 发布管理

基于 [semver](http://semver.org/lang/zh-CN/) 语义化版本号进行发布。

`master` 分支为当前稳定发布的版本。

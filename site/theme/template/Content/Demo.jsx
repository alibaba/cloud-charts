import React from 'react';
import ReactDOM from 'react-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import {Feedback, Icon} from '@alife/aisc';
import classNames from 'classnames';

export default class Demo extends React.Component {
  static contextTypes = {
    intl: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      codeExpand: false,
      sourceCode: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const {highlightedCode} = nextProps;
    const div = document.createElement('div');
    div.innerHTML = highlightedCode[1].highlighted;
    this.setState({sourceCode: div.textContent});
  }

  componentDidMount() {
    const {meta, location} = this.props;
    if (location && meta.id === location.hash.slice(1)) {
      this.anchor.click();
    }
    this.componentWillReceiveProps(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.codeExpand || this.props.expand) !== (nextState.codeExpand || nextProps.expand);
  }

  handleCodeExapnd = () => {
    this.setState({codeExpand: !this.state.codeExpand});
  }

  saveAnchor = (anchor) => {
    this.anchor = anchor;
  }

  render() {
    const state = this.state;
    const props = this.props;
    const {
      meta,
      src,
      content,
      preview,
      highlightedCode,
      style,
      highlightedStyle,
      expand,
    } = props;

    const codeExpand = this.state.codeExpand || expand;
    const codeBoxClass = classNames({
      'code-box': true,
      expand: codeExpand,
    });

    const locale = this.context.intl.locale;
    const localizedTitle = meta.title[locale] || meta.title;
    const localizeIntro = content[locale] || content;
    const introChildren = props.utils
      .toReactComponent(['div'].concat(localizeIntro));

    const highlightClass = classNames({
      'highlight-wrapper': true,
      'highlight-wrapper-expand': codeExpand,
    });
    return (
          <section className={codeBoxClass} id={meta.id}>
            {
              <section className="code-box-demo">
                  { preview(React, ReactDOM)}
                  {
                    style ?
                      <style dangerouslySetInnerHTML={{__html: style}}/> :
                      null
                  }
                </section>
            }
            <section className="code-box-meta markdown">
              <div className="code-box-title">
                <a href={`#${meta.id}`} ref={this.saveAnchor}>
                  {localizedTitle}
                </a>
              </div>
              {introChildren}
              <Icon type="arrow-down" title="Show Code" className="collapse" onClick={this.handleCodeExapnd}/>
            </section>
            <section className={highlightClass}
                     key="code"
            >
              <div className="highlight">
                <CopyToClipboard
                  text={state.sourceCode}
                  onCopy={() => Feedback.toast.success('Copied!')}
                >
                  <Icon type="view" className="code-box-code-copy"/>
                </CopyToClipboard>
                {props.utils.toReactComponent(highlightedCode)}
              </div>
              {
                highlightedStyle ?
                  <div key="style" className="highlight">
                <pre>
                  <code className="css" dangerouslySetInnerHTML={{__html: highlightedStyle}}/>
                </pre>
                  </div> :
                  null
              }
            </section>
          </section>
    );
  }
}

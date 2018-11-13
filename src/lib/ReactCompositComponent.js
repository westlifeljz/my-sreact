/*
    author : Element Luo
 */

import Component from "./Component";
import {react} from "./React";

import {eventtEmiiter, shouldUpdateReactComponent, findDomNodeBySreactId} from "./utils/utilsSreact";

class ReactCompositComponent {

  constructor(element) {
    this._currentElement = element;
    this._rootNodeID = null;
    this._instance = null;   // 缓存自定义组件实力
    this._renderedComponent = null;   // 组件 渲染后的react element 实例
    this._mountIndex = null;
  }

  mountComponent = (rootID) => {
    this._rootNodeID = rootID;

    let publicProps = this._currentElement.props;

    let ReactClass = this._currentElement.type;

    let inst = new ReactClass (publicProps);
    this._instance = inst;

    inst._reactInternalInstance = this;

    if (inst.componentWillMount) {
      inst.componentWillMount.call (inst);
    }

    let renderedElement = this._instance.render();
    let renderedComponentInstance = react.instantiateReactComponent(renderedElement);
    this._renderedComponent = renderedComponentInstance;
    let renderedMarkup = renderedComponentInstance.mountComponent(this._rootNodeID);

    eventtEmiiter.on("mountReady", () => {
      inst.componentDidMount && inst.componentDidMount();
    });

    return renderedMarkup;
  }

  receiveComponent = (nextElement, newState) => {
    this._currentElement = nextElement || this._currentElement;

    let inst = this._instance;

    let nextState = Object.assign({}, inst.state, newState);
    let nextProps = this._currentElement.props;

    inst.state = nextState;

    if(inst.shouldComponentUpdate && (inst.shouldComponentUpdate(nextProps, newState) === false)) {
      return false;
    }
    if (inst.componentWillUpdate) {
      inst.componentWillUpdate(nextProps, nextState);
    }

    let previousComponentInstance = this._renderedComponent;
    let previousRenderedElement = previousComponentInstance._currentElement;

    let nextRenderedElement = this._instance.render();

    if (shouldUpdateReactComponent(previousRenderedElement, nextRenderedElement)) {
      previousComponentInstance.receiveComponent(nextRenderedElement);
      inst.componentDidUpdate && inst.componentDidUpdate();
    }
    else {
      let thisID = this._rootNodeID;
      this._renderedComponent = react.instantiateReactComponent(nextRenderedElement);
      let nextMarkup = this._renderedComponent.mountComponent(thisID);

      let sreactId = thisID;
      let dom = findDomNodeBySreactId (sreactId);
      dom.innerHTML = nextMarkup;
    }
  };
}

export default ReactCompositComponent
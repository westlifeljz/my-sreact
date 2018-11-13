import ReactDomTextComponent from "./ReactDomTextComponent";
import ReactElement from "./ReactElement";
import ReactDomComponent from "./ReactDomComponent";
import ReactCompositComponent from "./ReactCompositComponent";


import {eventtEmiiter} from "./utils/utilsSreact";

class React {
  constructor () {
    this.nextReactRootIndex = 0;

    this.updateDepth = 0;
    this.diffQueue = [];
  }

  instantiateReactComponent =  (reactElement) => {
    if (typeof reactElement == "string" || typeof reactElement == "number") {
      return new ReactDomTextComponent (reactElement);
    }
    if(typeof reactElement === 'object' && typeof reactElement.type === 'string'){
      return new ReactDomComponent(reactElement);
    }
    if(typeof reactElement === 'object' && typeof reactElement.type === 'function'){
      return new ReactCompositComponent(reactElement);

    }
  }

  createElement = (type,config,children) => {
    let props = {};
    config = config || {};

    let key = config.key || null;

    for (let propName in config) {
      if (config.hasOwnProperty(propName) && propName != "key" ) {
        props[propName] = config[propName];
      }
    }

    let childrenLength = arguments.length - 2;

    if (type && config && children) {
      if (Object.prototype.toString.call(children) == "[object Array]") {
        props.children = children;
      }
      else {
        props.children = [children];
      }
    }

    /*
    if (childrenLength == 1) {
      if (Object.prototype.toString.call(children) == "[object Array]") {
        props.children = children;
      }
      else {
        props.children = [children];
      }
    }
    else if (childrenLength > 1 ) {
      let childArray = Array (childrenLength);
      for (let i = 0; i < childrenLength; i ++ ) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }
    */
    return new ReactElement (type, key, props );
  }

  render = (element, container) => {
    let componentInstance = this.instantiateReactComponent(element);
    let markup = componentInstance.mountComponent(this.nextReactRootIndex ++);
    container.innerHTML = markup;
    eventtEmiiter.emit("mountReady");
  }
}


let react = new React();

export {
  react
};
/*
    author : Element Luo
 */

import {delegate, undelegate} from "./utils/degelateUtil";
import {
  eventtEmiiter,
  shouldUpdateReactComponent,
  findDomNodeBySreactId,
  flattenChildren,
  generateComponentChildren,
  insertChildNodeAtIdx,
  removeNode,
  UPDATE_TYPES
} from "./utils/utilsSreact";
import {react} from "./React";
import ReactDomTextComponent from "./ReactDomTextComponent";


class ReactDomComponent {
  constructor(element) {
    this._currentElement = element;
    this._rootNodeID = null;
    this._renderedChildren = null;
    this._mountIndex = null;
  }

  mountComponent = (rootID) => {
    this._rootNodeID = rootID;
    let props = this._currentElement.props;
    let tagStart = "<" + this._currentElement.type;
    let tagEnd = "</" + this._currentElement.type + ">";

    tagStart += ' data-sreactid=' + this._rootNodeID;

    for (var propKey in props) {
      if (/^on[A-Za-z]/.test(propKey)) {
        let eventType = propKey.replace('on', '');
        delegate(this._rootNodeID, eventType, props[propKey]);

      }

      if (props[propKey] && propKey != 'children' && !/^on[A-Za-z]/.test(propKey)) {
        tagStart += ' ' + propKey + '=' + props[propKey];
      }
    }

    let content = "";
    let children = props.children || [];

    let childrenInstances = [];


    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let key = i;

      let childComponentInstance = react.instantiateReactComponent(child);
      childrenInstances.push(childComponentInstance);

      childComponentInstance._mountIndex = key;
      console.log(childComponentInstance._mountIndex + " childComponentInstance._mountIndex");

      let curRootId = this._rootNodeID + "." + key;

      console.log(curRootId);
      let childMarkup = childComponentInstance.mountComponent(curRootId);

      content += " " + childMarkup;

    }

    this._renderedChildren = childrenInstances;

    return tagStart + ">" + content + tagEnd;
  }

  receiveComponent = (nextElement) => {
    let lastProps = this._currentElement.props;
    let nextProps = nextElement.props;

    this._currentElement = nextElement;
    this._updateDOMProperties(lastProps, nextProps);
    //再更新子节点
    // if (nextElement.props.children == undefined ) {
    //   throw "children is undefined"
    // }
    if (nextElement.props.children != undefined) {
      this._updateDOMChildren(nextElement.props.children);
    }

  }


  _updateDOMProperties = (lastProps, nextProps) => {
    let propKey = null;

    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey)) {
        continue;
      }
      if (/^on[A-Za-z]/.test(propKey)) {
        let eventType = propKey.replace("on", "");
        undegelate(this._rootNodeID, eventType, lastProps[propKey]);
        continue;
      }
      let dom = findDomNodeBySreactId(this._rootNodeID);
      dom.removeAttribute(propKey);
    }

    for (propKey in nextProps) {
      if (/^on[A-Za-z]/.test(propKey)) {
        let eventType = propKey.replace('on', '');
        if (lastProps[propKey]) {
          undelegate(this._rootNodeID, eventType, lastProps[propKey]);
        }
        delegate(this._rootNodeID, eventType, nextProps[propKey]);
      }

      if (propKey == "children") {
        continue;
      }

      let dom = findDomNodeBySreactId(this._rootNodeID);
      dom.setAttribute(propKey, nextProps[propKey]);
    }
  }

  _updateDOMChildren = (nextChildrenElements) => {
    react.updateDepth++;
    this._diff(react.diffQueue, nextChildrenElements);
    react.updateDepth--;
    if (react.updateDepth == 0) {
      this._patch(react.diffQueue);
      react.diffQueue = [];
    }
  }

  _diff = (diffQueue, nextChildrenElements) => {
    let prevChildren = flattenChildren(this._renderedChildren);
    let nextChildren = generateComponentChildren(prevChildren, nextChildrenElements);

    this._renderedChildren = [];

    // for (let i = 0; i < nextChildren.length; i ++) {
    //   this._renderedChildren.push(nextChildren[i]);
    // }

    for (let key in nextChildren) {
      this._renderedChildren.push(nextChildren[key]);
    }


    let nextIndex = 0;
    for (let name in nextChildren) {
      if (!nextChildren.hasOwnProperty(name)) {
        continue;
      }


      let prevChild = prevChildren[name];
      let nextChild = nextChildren[name];

      if (prevChild == nextChild) {
        react.diffQueue.push({
          parentId: this._rootNodeID,
          parentNode: findDomNodeBySreactId(this._rootNodeID),
          type: UPDATE_TYPES.MOVE_EXISTING,
          fromIndex: prevChild._mountIndex,
          toIndex: null
        });
      }
      else {
        if (prevChild) {
          react.diffQueue.push({
            parentId: this._rootNodeID,
            parentNode: findDomNodeBySreactId(this._rootNodeID),
            type: UPDATE_TYPES.REMOVE_NODE,
            fromIndex: prevChild._mountIndex,
            toIndex: null
          })

          if (prevChild._rootNodeID) {
            undelegate(prevChild._rootNodeID);
          }
        }
        // 文本节点，没有实际dom 可以作为标识，所以需要通过父节点重新拼装新节点标识。
        if (nextChild instanceof ReactDomTextComponent) {
          let curNode = this._rootNodeID + "." + 0
          react.diffQueue.push({
            parentId: this._rootNodeID,
            parentNode: findDomNodeBySreactId(this._rootNodeID),
            type: UPDATE_TYPES.INSERT_MARKUP,
            fromIndex: null,
            toIndex: nextIndex,
            markup: nextChild.mountComponent(curNode)
          });
        }
        else {
          react.diffQueue.push({
            parentId: this._rootNodeID,
            parentNode: findDomNodeBySreactId(this._rootNodeID),
            type: UPDATE_TYPES.INSERT_MARKUP,
            fromIndex: null,
            toIndex: nextIndex,
            markup: nextChild.mountComponent(this._rootNodeID)
          });
        }

      }

      nextChild._mountIndex = nextIndex;

      nextIndex++;
    }

    // remove previous compoenent children
    for (let name  in prevChildren) {
      if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
        react.diffQueue.push({
          parentId: this._rootNodeID,
          parentNode: findDomNodeBySreactId(this._rootNodeID),
          type: UPDATE_TYPES.REMOVE_NODE,
          fromIndex: prevChildren[name]._mountIndex,
          toIndex: null
        })
      }

      if (prevChildren[name]._rootNodeID) {
        undelegate( prevChildren[name]._rootNodeID);
      }
    }
  }


  _patch = (updates) => {
    let initialChildren = {};
    let deleteChildren = [];

    for (let i = 0 ; i < updates.length; i++) {
      let update = updates[i];
      if (update.type == UPDATE_TYPES.MOVE_EXISTING || update.type == UPDATE_TYPES.REMOVE_NODE) {
        let updateFromIndex = update.fromIndex;
        let updatedChild = update.parentNode.childNodes[updateFromIndex];
        let parentId = update.parentId;

        initialChildren[parentId] = initialChildren[parentId] || [];
        initialChildren[parentId][updateFromIndex] = updatedChild;

        deleteChildren.push(updatedChild);

      }
    }


    for (let i = 0; i < deleteChildren.length; i ++) {
      removeNode(deleteChildren[i]);
    }


    for (let i = 0 ; i < updates.length; i++) {
      let update = updates[i];
      switch (update.type) {
        case UPDATE_TYPES.INSERT_MARKUP:
          console.log("UPDATE_TYPES.INSERT_MARKUP");
          insertChildNodeAtIdx(update.parentNode, update.markup, update.toIndex);
          break;
        case UPDATE_TYPES.MOVE_EXISTING:
          console.log("UPDATE_TYPES.MOVE_EXISTING");
          insertChildNodeAtIdx(update.parentNode, initialChildren[update.parentId][update.fromIndex], update.fromIndex);
          break;
        case UPDATE_TYPES.REMOVE_NODE:
          break;
      }
    }
  }

}

export default ReactDomComponent;
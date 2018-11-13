import EventEmitter from "events";
import {react} from "../React";

const eventtEmiiter = new EventEmitter();

const UPDATE_TYPES = {
  MOVE_EXISTING: 1,
  REMOVE_NODE: 2,
  INSERT_MARKUP: 3
};


const shouldUpdateReactComponent = (previousElement, nextElement) => {
  if (previousElement != null && nextElement != null) {
    let previousType = typeof previousElement;
    let nextType = typeof  nextElement;
    if (previousType == "string" || previousType == "number") {
      return previousType == "string" || previousType == "number";
    }
    else {
      return nextType === "object" && previousElement.type === nextElement.type && previousElement.key === nextElement.key;
    }
  }
  return false;
}


const findDomNodeBySreactId = (sreactId) => {
  let domNode = traverseNodes(document.getElementsByTagName("body")[0], sreactId);
  return domNode
}


const traverseNodes = (node, sreactId) => {
  let domNode = null;
  // if (node.nodeType == 1) {

    if (node.hasChildNodes) {
      let sonnodes = node.childNodes;
      for (let i = 0; i < sonnodes.length; i++) {
        let sonnode = sonnodes.item(i);

        if (sonnode.nodeType == 1) {
          let nodeSreactid = sonnode.getAttribute("data-sreactid");
          if (sreactId == nodeSreactid) {
            return sonnode;
          }
          else {
            if (!domNode) {
              domNode = traverseNodes(sonnode, sreactId);
            }

          }
        }


      }
    }
  // }
  return domNode;
}


const flattenChildren = (componentChildren) => {
  let child = null;
  let name = null;
  let childrenMap = {};
  for (let i = 0; i < componentChildren.length; i++) {
    child = componentChildren[i];
    name = child && child._currentElement && child._currentElement.key ? child._currentElement.key : i.toString(36);
    childrenMap[name] = child;
  }
  return childrenMap;
}

const generateComponentChildren = (prevChildren, nextChildrenElements) => {
  let nextChildren = {};
  nextChildrenElements = nextChildrenElements || [];
  for (let i = 0; i < nextChildrenElements.length; i++) {
    let element = nextChildrenElements[i];

    console.log(element);
    // if (typeof element == "string") {
    //   element = react.instantiateReactComponent(element);
    // }
    let name = element.key ? element.key : i;
    let prevChild = prevChildren && prevChildren[name];
    let prevElement = prevChild && prevChild._currentElement ? prevChild._currentElement : undefined;
    let nextElement = element;

    if (shouldUpdateReactComponent(prevElement, nextElement)) {
      prevChild.receiveComponent(nextElement);
      nextChildren[name] = prevChild;
    }
    else {
      let nextChildrenInstance = react.instantiateReactComponent(nextElement, null);
      nextChildren[name] = nextChildrenInstance;
    }
  }
  return nextChildren;
}


const insertChildNodeAtIdx = (parentNode, childNode, index) => {
  let beforeNode = parentNode.childNodes[index];
  if (typeof childNode == "string" ) {
    childNode = document.createTextNode(childNode);
  }
  // if (childNode) {
  //   return;
  // }
  console.log("*************");
  console.log(index + "   ***");
  console.log(parentNode);
  console.log(childNode);
  // if (childNode == undefined) {
  //   return
  // }
  beforeNode ? parentNode.insertBefore(childNode, beforeNode) : parentNode.appendChild(childNode);
}


const removeNode = (node) => {
  if (!node) return;
  if (node.parentNode) node.parentNode.removeChild(node);

}


export {
  UPDATE_TYPES,
  shouldUpdateReactComponent,
  findDomNodeBySreactId,
  flattenChildren,
  generateComponentChildren,
  eventtEmiiter,
  insertChildNodeAtIdx,
  removeNode
};
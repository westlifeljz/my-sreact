/*
    author : Element Luo
 */

import {eventtEmiiter, shouldUpdateReactComponent, findDomNodeBySreactId} from "./utils/utilsSreact";

class ReactDomTextComponent {
  constructor (text) {
    this._currentElement = "" + text;
    this._rootNodeID = null;
    this._parentNode = null;
    this._mountIndex = null;
    this._parentNodeId = "";
  }

  mountComponent = (rootID) => {
    this._rootNodeID = rootID

    let tempIdArray = rootID.split(".");
    tempIdArray.pop ();
    this._parentNodeId = tempIdArray.join(".");

    // this._parentNodeId = rootID;
    // this._rootNodeID = rootID + "." + 0;
    // return "<span data-sreactid='" + rootID + "'>" + this._currentElement + "</span>";
      return this._currentElement;
  };

  receiveComponent = (nextText) => {
    let nextStrText = "" + nextText;
    if (nextStrText != this._currentElement) {
      this._currentElement = nextStrText;
      let domNode = findDomNodeBySreactId(this._parentNodeId);
      domNode.innerHTML = this._currentElement;
    }
  };
}

export default ReactDomTextComponent;
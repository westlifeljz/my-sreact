class DelegateEvt {
  constructor(eventType) {
    this.delegateDomArray = [];
    this.eventType = eventType;
  }
}

let delegateEventObjectArray = [];
let delegateClick = new DelegateEvt("click");
let delegateKeyup = new DelegateEvt("keyup");

const delegate = (sreactid, eventType, handler) => {
  switch (eventType) {
    case "click" :
      delegateClick.delegateDomArray.push({
        sreactid,
        handler
      })
      break;
    case "keyup":
      delegateKeyup.delegateDomArray.push({
        sreactid,
        handler
      })
      break;
  }


  // for (let i = 0; i < degelateEventObjectArray.length; i++) {
  //   let degelateEventObj = degelateEventObjectArray[i];
  //   if (degelateEventObj.eventType == eventType) {
  //     degelateEventObj.degelateDomArray.push({
  //       sreactid: sreactid,
  //       handler: handler
  //     });
  //     return;
  //   }
  // }
  //
  // let degelateEvent = new DegelateEvt(eventType);
  // degelateEvent.degelateDomArray.push({
  //   reactid: reactid,
  //   handler: handler
  // });

}

const undelegate = (sreactid, eventType, handler) => {
  switch (eventType) {
    case "click" :
      _undelegateSingleEvent (sreactid, handler,delegateClick );
      return true;
      break;
    case "keyup" :
      _undelegateSingleEvent (sreactid, handler,delegateKeyup );
      return true;
      break;
    default :

      break;
  }
  if (arguments.length == 1 && !eventType) {
    _undelegateSingleEvent (sreactid );
  }
  return false;
}


let _undelegateSingleEvent = (sreactid, handler, delegateEventType) =>{
  let array = delegateEventType.delegateDomArray;

  if (arguments.length == 1) {
    for (let i = array.length - 1 ; i >= 0; i--) {
      let obj = array [i];
      if (obj.sreactid == sreactid) {
        array.splice(i, 1);
      }
    }
    return true;
  }
  else {
    for (let i = array.length - 1; i >= 0; i--) {
      let obj = array [i];
      if (array [i].sreactid == sreactid && array [i].handler == handler) {
        array.splice(i, 1);
        return true;
      }
    }
  }

  return false;
}


let documentClickInit = (degelateEvent) => {

  document.addEventListener("click", (event) => {

    for (let i = 0; i < degelateEvent.delegateDomArray.length; i++) {
      let dom = degelateEvent.delegateDomArray[i];


      if (event.target.getAttribute("data-sreactid") == dom.sreactid) {
        dom.handler.call(this, event);
      }
    }

  }, true);
};

let documentKeyupInit = (degelateEvent) => {

  document.addEventListener("keyup", (event) => {
  console.log("keyup");
    for (let i = 0; i < degelateEvent.delegateDomArray.length; i++) {
      let dom = degelateEvent.delegateDomArray[i];


      if (event.target.getAttribute("data-sreactid") == dom.sreactid) {
        dom.handler.call(this, event);
      }
    }

  }, true)
}


let sreactInit = () => {
  documentClickInit (delegateClick);
  documentKeyupInit(delegateKeyup);
}

sreactInit();

export {
  undelegate,
  delegate
};
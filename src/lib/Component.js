
class Component {
  constructor (props) {
    this._reactInternalInstance = null;
    this.props = props;
    this.state = null;
  }

  render = () => {

  }

  setState = (newState, func) => {
    this._reactInternalInstance.receiveComponent (null, newState);
    if (func) {
      func();
    }
  }
}

export default Component;
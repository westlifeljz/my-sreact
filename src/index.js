import {react } from "./lib/React";
import Component from "./lib/Component";


class Test extends Component {
  constructor () {
    super();
    this.state = {
      text: "",
      items: []
    };
  }

  render = () => {
    return react.createElement("div", null,
      [
        react.createElement("div", {}, "ljz"),

      ]);
  }
}

class TodoList extends Component {
  constructor () {
    super();
    this.state = {
      text: "",
      items: []
    };
  }


  add = () => {
    console.log("add");
    let nextItems = this.state.items.concat([this.state.text]);
    this.setState({
      items: nextItems,
      text: ''
    });
    console.log(this.state.items);
  }

  onChange = (e) =>{
    console.log(e);
    this.setState({text: e.target.value});
  }

  render = () => {
    // let createItem = function(itemText) {
    //   return react.createElement("div", null, itemText);
    // };
    //
    // let lists = this.state.items.map(createItem);
    //
    // let input = react.createElement("input", {onkeyup: this.onChange.bind(this),value: this.state.text});
    // let button = react.createElement("p", {onclick: this.add.bind(this)}, 'Add#' + (this.state.items.length + 1));
    // let children = lists.concat([input,button]);

    return react.createElement("div", null,
        [
          react.createElement(Test) ,
          react.createElement("input", {onkeyup: this.onChange.bind(this),value: this.state.text}),
          react.createElement("button", {onclick: this.add.bind(this)}, 'test ' + (this.state.items.length + 1)),
          react.createElement("div", {}, this.state.text),
          react.createElement("div", {}, this.state.items),

        ]
      );
  }
}


react.render(
  react.createElement(TodoList),

  document.getElementById("reactInit"));
/* eslint-disable react/prefer-es6-class  */
import React, { PropTypes } from 'react';
import { ENTER_KEY } from './constants';

const Header = React.createClass({

  propTypes: {
    model: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      newTodo: '',
    };
  },

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.state.newTodo.trim();

    if (val) {
      this.props.model.addTodo(val);
      this.setState({ newTodo: '' });
    }
  },

  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  },

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={this.state.newTodo}
          onKeyDown={this.handleNewTodoKeyDown}
          onChange={this.handleChange}
          autoFocus
        />
      </header>
    );
  },
});

export default Header;

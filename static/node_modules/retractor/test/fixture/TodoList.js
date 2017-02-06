/* eslint-disable react/prefer-es6-class  */
import React, { PropTypes } from 'react';
import TodoItem from './TodoItem';

const TodoList = React.createClass({

  propTypes: {
    todos: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
    onToggleAll: PropTypes.func.isRequired,
    onDestroy: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      editing: null,
    };
  },

  edit(todo) {
    this.setState({ editing: todo.id });
  },

  save(todoToSave, text) {
    this.props.onSave(todoToSave, text);
    this.setState({ editing: null });
  },

  cancel() {
    this.setState({ editing: null });
  },

  resolveActiveTodoCount(todos) {
    return todos.reduce((accum, todo) => (
      todo.completed ? accum : accum + 1
    ), 0);
  },

  renderTodoItems() {
    const { todos, onToggle, onDestroy } = this.props;
    return todos.map(todo =>
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDestroy={onDestroy}
          onEdit={this.edit}
          editing={this.state.editing === todo.id}
          onSave={this.save}
          onCancel={this.cancel}
        />
    );
  },

  render() {
    const { todos, onToggleAll } = this.props;
    const activeTodoCount = this.resolveActiveTodoCount(todos);


    if (todos.length) {
      return (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={onToggleAll}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            {this.renderTodoItems()}
          </ul>
        </section>
      );
    }
    return null;
  },
});

export default TodoList;

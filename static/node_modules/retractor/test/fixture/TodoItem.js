/* eslint-disable react/prefer-es6-class  */
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const resolveItemStyle = (props) => {
  const completed = props.todo.completed ? 'completed' : '';
  const editing = props.editing ? 'editing' : '';
  return `${completed} ${editing}`;
};

const TodoItem = React.createClass({

  propTypes: {
    editing: PropTypes.bool.isRequired,
    todo: PropTypes.object.isRequired,
    onDestroy: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      editText: this.props.todo.title,
    };
  },

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  },

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      const node = findDOMNode(this.refs.editField);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  },

  onToggle() {
    const { todo } = this.props;
    this.props.onToggle(todo);
  },

  onDestroy() {
    const { todo } = this.props;
    this.props.onDestroy(todo);
  },

  handleSubmit() {
    const { todo } = this.props;
    const val = this.state.editText.trim();
    if (val) {
      this.props.onSave(todo, val);
      this.setState({ editText: val });
    } else {
      this.props.onDestroy(todo);
    }
  },

  handleEdit() {
    const { todo } = this.props;
    this.props.onEdit(todo);
    this.setState({ editText: this.props.todo.title });
  },

  handleKeyDown(event) {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title });
      this.props.onCancel(event);
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  },

  handleChange(event) {
    if (this.props.editing) {
      this.setState({ editText: event.target.value });
    }
  },

  render() {
    return (
      <li className={resolveItemStyle(this.props)}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.onToggle}
          />
          <label onDoubleClick={this.handleEdit}>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  },
});

export default TodoItem;

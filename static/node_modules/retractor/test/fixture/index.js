import React from 'react';
import { render } from 'react-dom';
import TodoModel from './TodoModel';
import TodoApp from './TodoApp';

const list1 = new TodoModel('todolist-1');
const list2 = new TodoModel('todolist-2');
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

const getHashRoute = () => {
  const hash = document.location.hash;
  const route = hash.substring(2); // trim '/#'

  switch (route) {
    case COMPLETED_TODOS:
      return COMPLETED_TODOS;
    case ACTIVE_TODOS:
      return ACTIVE_TODOS;
    default:
      return ALL_TODOS;
  }
};

function renderApp() {
  const route = getHashRoute();
  render(
    <TodoApp model={ list1 } route={route} />,
    document.getElementById('app-1')
  );
  render(
    <TodoApp model={ list2 } route={route} />,
    document.getElementById('app-2')
  );
}

window.onpopstate = function handler() {
  renderApp();
};

list1.subscribe(renderApp);
list2.subscribe(renderApp);
renderApp();

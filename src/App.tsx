/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import classNames from 'classnames';
import { ErrorNotification } from './ErrorNotification';

import { getTodos } from '../src/api/todos';
import { Todo } from '../src/types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleError = (errorType: string) => {
    switch (errorType) {
      case 'load':
        setError('Unable to load todos');
        break;
      case 'add':
        setError('Unable to add a todo');
        break;
      case 'delete':
        setError('Unable to delete a todo');
        break;
      case 'update':
        setError('Unable to update a todo');
        break;
      default:
        setError('An unknown error occured');
    }
    setIsErrorVisible(true);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosData = await getTodos();
        setTodos(todosData);
        setError(null);
      } catch (err) {
        handleError('load');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">

          {filteredTodos.map(todo => (
          <div data-cy="Todo" key={todo.id} className={classNames('todo', { completed: todo.completed })}>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {activeTodosCount} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
              onClick={() => setFilter('all')}
              data-cy="FilterLinkAll"
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
              onClick={() => setFilter('active')}
              data-cy="FilterLinkActive"
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
              onClick={() => setFilter('completed')}
              data-cy="FilterLinkCompleted"
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </footer>
        )}
      </div>
      <ErrorNotification
        error={isErrorVisible ? error : null}
        onClose={() => {
          setIsErrorVisible(false);
          setError(null);
        }}
      />
    </div>
  );
};

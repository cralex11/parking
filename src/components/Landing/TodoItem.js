import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'rsuite';

const TodoItem = ({ todo, remove }) => (
  <List.Item style={{ listStyle: 'none' }}>
    {todo.text}
    <Button type="button" onClick={() => remove(todo)}>
      x
    </Button>
  </List.Item>
);

TodoItem.propTypes = {
  todo: PropTypes.shape({ text: PropTypes.string }),
  remove: PropTypes.func.isRequired,
};

TodoItem.defaultProps = {
  todo: {},
};

export default TodoItem;

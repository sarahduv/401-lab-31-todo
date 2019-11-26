import React, { useState, useEffect, useReducer } from "react";
import { When } from "../if";
import Modal from "../modal";
import Form from "./todo-form";

import "./todo.scss";

const todoAPI = "https://api-js401.herokuapp.com/api/v1/todo";

const ToDo = props => {
  // constructor(props) {
  //   super(props);
  //   state = {
  //     todoList: [],
  //     item: {},
  //     showDetails: false,
  //     details: {}
  //   };
  // }

  let [todoList, setTodoList] = useState([]);
  let [item, setItem] = useState({});
  let [showDetails, setShowDetails] = useState(false);
  let [details, setDetails] = useState({});

  const handleInputChange = e => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const callAPI = (url, method = "get", body, handler, errorHandler) => {
    return fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    })
      .then(response => response.json())
      .then(data => (typeof handler === "function" ? handler(data) : null))
      .catch(e =>
        typeof errorHandler === "function" ? errorHandler(e) : console.error(e)
      );
  };

  const addItem = e => {
    e.preventDefault();
    e.target.reset();

    const _updateState = newItem => setTodoList([...todoList, newItem]);

    callAPI(todoAPI, "POST", item, _updateState);
  };

  const deleteItem = id => {
    const _updateState = results =>
      setTodoList(todoList.filter(_item => _item._id !== id));

    callAPI(`${todoAPI}/${id}`, "DELETE", undefined, _updateState);
  };

  const saveItem = updatedItem => {
    const _updateState = newItem =>
      setTodoList(
        todoList.map(_item => (_item._id === newItem._id ? newItem : _item))
      );

    callAPI(`${todoAPI}/${updatedItem.id}`, "PUT", updatedItem, _updateState);
  };

  const toggleComplete = id => {
    let _item = todoList.filter(i => i._id === id)[0] || {};
    if (_item._id) {
      _item.complete = !_item.complete;
      saveItem(_item);
    }
  };

  const toggleDetails = id => {
    let _showDetails = !showDetails;
    let details = todoList.filter(_item => _item._id === id)[0] || {};
    setDetails(details);
    setShowDetails(_showDetails);
  };

  const getTodoItems = () => {
    const _updateState = data => setTodoList(data.results);
    callAPI(todoAPI, "GET", null, _updateState);
  };

  // const componentDidMount = () => {
  //   getTodoItems();
  // };

  useEffect(() => {
    getTodoItems();
  }, []);

  return (
    <>
      <header>
        <h2>
          There are
          {todoList.filter(_item => !_item.complete).length}
          Items To Complete
        </h2>
      </header>

      <section className="todo">
        <Form handleInputChange={handleInputChange} addItem={addItem} />

        <div>
          <ul>
            {todoList.map(_item => (
              <li
                className={`complete-${_item.complete.toString()}`}
                key={_item._id}
              >
                <span onClick={() => toggleComplete(_item._id)}>
                  {_item.text}
                </span>
                <button onClick={() => toggleDetails(_item._id)}>
                  Details
                </button>
                <button onClick={() => deleteItem(_item._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <When condition={showDetails}>
        <Modal title="To Do Item" close={toggleDetails}>
          <div className="todo-details">
            <header>
              <span>Assigned To: {details.assignee}</span>
              <span>Due: {details.due}</span>
            </header>
            <div className="item">{details.text}</div>
          </div>
        </Modal>
      </When>
    </>
  );
};

export default ToDo;

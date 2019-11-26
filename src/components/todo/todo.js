import React, { useState, useEffect, useReducer } from "react";
import uuid from "uuid/v4";
import { When } from "../if";
import Modal from "../modal";

import "./todo.scss";

const ToDo = (props) => {


let [todoList, setTodoList] = useState([]);
let [item, setItem] = useState({});
let [showDetails, setShowDetails] = useState(false);
let [details, setDetails] = useState({});

  handleInputChange = e => {
    setItem({...item, [e.target.name]: e.target.value});
  };

  handleSubmit = (e) => {
    props.handleSubmit(item);
  };

  addItem = (e) => {

    e.preventDefault();
    e.target.reset();

    const defaults = { _id: uuid(), complete:false };
    const item = Object.assign({}, item, defaults);

    setTodoList([...todoList, item]);
    setItem({})

  };

  deleteItem = id => {

    setTodoList(todoList.filter(item => item._id !== id));

  };

  saveItem = updatedItem => {

    setTodoList(todoList.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      ));

  };

  toggleComplete = id => {
    let item = todoList.filter(i => i._id === id)[0] || {};
    if (item._id) {
      item.complete = !item.complete;
      saveItem(item);
    }
  };

  toggleDetails = id => {
    let showDetails = ! showDetails;
    let details = todoList.filter( item => item._id === id )[0] || {}
    setDetails(details);
    setShowDetails(showDetails);
  }

  render() {

    return (
      <>
        <header>
          <h2>
            There are
            {todoList.filter( item => !item.complete ).length}
            Items To Complete
          </h2>
        </header>

        <section className="todo">

        <Form handleInputChange={handleInputChange} addItem={addItem} />

          <div>
            <ul>
              { todoList.map(item => (
                <li
                  className={`complete-${item.complete.toString()}`}
                  key={item._id}
                >
              <span onClick={() => toggleComplete(item._id)}>
                {item.text}
              </span>
                  <button onClick={() => toggleDetails(item._id)}>
                    Details
                  </button>
                  <button onClick={() => deleteItem(item._id)}>
                    Delete
                  </button>
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
              <div className="item">
                {details.text}
              </div>
            </div>
          </Modal>
        </When>
      </>
    );
  }
}

export default ToDo;

import Todo from './components/Todo.js';
import Form from './components/Form.js';
import FilterButton from './components/FilterButton.js';
import React, {useEffect, useRef, useState} from 'react';
import {usePrevious} from './functions/usePrevious';
import {nanoid} from 'nanoid';

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props)
{
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');

  const taskHeadingRef = useRef(null);
  const taskFoundRef = useRef(null);

  // Tasks To Be Done
  function taskTBD(){
    let length = tasks.filter(FILTER_MAP["Active"]).length;
    const taskNoun = (length !== 1) ? 'tasks' : 'task';
    if(length !== 0)
      return `${length} ${taskNoun} to be done`;
    
    return "All tasks are completed!"
  }

  // Tasks Founded
  function taskFound(filter){
    let length = tasks.filter(FILTER_MAP[filter]).length;
    const taskNoun = (length !== 1) ? 'tasks' : 'task';
    if(length !== 0)
      return `${length} ${taskNoun} found at ${filter} section`;
  
    return `No task found at ${filter} section`;
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map(task => (
    <Todo 
      key={task.id}
      name={task.name} 
      id={task.id} 
      completed={task.completed} 
      toggleTaskCompleted = {toggleTaskCompleted}
      deleteTask = {deleteTask}
      editTask = {editTask}
    />)
  );

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key = {name}
      name = {name}
      isPressed = {name === filter}
      setFilter = {setFilter}
    />
  ));

  /**
   * @param {String} name 
   */
  function addTask(name)
  {
    const newTask = {id:`todo-${nanoid()}`, name: name, completed: false};
    setTasks([...tasks, newTask]);
  }

  function editTask(id, newName)
  {
    const updatedTasks = tasks.map(task => {
      if(task.id === id)
        return {...task, name: newName};

      return task;
    })

    setTasks(updatedTasks);
  }

  /**
   * @param {String} id 
   */
  function deleteTask(id)
  {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);

  }

  function toggleTaskCompleted(id)
  {
    const updatedTasks = tasks.map(task => {
      if(task.id === id)
        return {...task, completed: !task.completed};

      return task;
    })

    setTasks(updatedTasks);
  }

  const prevTaskLength = usePrevious(tasks.length);
  const prevFilter = usePrevious(filter);
  useEffect(()=>{
    if(tasks.length - prevTaskLength === -1)
      taskHeadingRef.current.focus();
    if(prevFilter !== filter)
      taskFoundRef.current.focus();
  }, [tasks.length, filter]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 tabIndex="-1" ref={taskFoundRef}>
      {taskFound(filter)}
      </h2>
      <h3 id="list-heading" tabIndex="-1" ref={taskHeadingRef}>
      {taskTBD()}
      </h3>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}


export default App;

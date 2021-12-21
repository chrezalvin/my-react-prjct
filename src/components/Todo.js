import React, {useEffect, useRef, useState} from 'react';
import {usePrevious} from '../functions/usePrevious.js';

function Todo(props)
{
    const [isEditing, setEditing] = useState(false);
    const [setName, setNewName] = useState(props.name);

    const editFieldRef = useRef(null);
    const editButtonRef = useRef(null);
    const wasEditing = usePrevious(isEditing);

    /**
     * @param {Event} e 
     */
    function handleNameChange(e)
    {
        setNewName(e.target.value);
    }

    /**
    * @param {Event} e 
    */
    function handleSubmit(e)
    {
        e.preventDefault();
        props.editTask(props.id, setName);
        setEditing(false);
    }

    const editingTemplate = (
        <form className="stack-small">
            <div className="form-group">
                <label className="todo-label" htmlFor={props.id}>
                    New name for {props.name}
                </label>
                <input 
                    id={props.id} 
                    className="todo-text" 
                    type="text" 
                    onChange={handleNameChange}
                    value={setName}
                    ref = {editFieldRef}
                />
            </div>
            <div className="btn-group">
                <button 
                    type="button" 
                    className="btn todo-cancel" 
                    onClick={() => {setEditing(false); setNewName(props.name)}}
                >
                    Cancel
                    <span className="visually-hidden">renaming {props.name}</span>
                </button>
                <button 
                    type="submit" 
                    className="btn btn__primary todo-edit" 
                    onClick={handleSubmit}
                >
                    Save
                    <span className="visually-hidden">new name for {props.name}</span>
                </button>
            </div>
        </form>
    );

    const viewTemplate = (
        <div className="stack-small">
            <div className="c-cb">
                <input
                    id={props.id}
                    type="checkbox"
                    defaultChecked={props.completed}
                    onChange={() => props.toggleTaskCompleted(props.id)}
                />
                <label className="todo-label" htmlFor={props.id}>
                    {props.name}
                </label>
            </div>
            <div className="btn-group">
                <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setEditing(true)}
                    ref = {editButtonRef}
                >
                    Edit <span className="visually-hidden">{props.name}</span>
                </button>
                <button
                    type="button"
                    className="btn btn__danger"
                    onClick={() => props.deleteTask(props.id)}
                >
                    Delete <span className="visually-hidden">{props.name}</span>
                </button>
            </div>
        </div>
    );

    useEffect(()=>{
        if(!wasEditing && isEditing)
            editFieldRef.current.focus();
        if(wasEditing && !isEditing)
            editButtonRef.current.focus();
    }, [wasEditing, isEditing]);

    return (
    <li className="todo stack-small">
        {isEditing ? editingTemplate: viewTemplate}
    </li>
    );
};

export default Todo;
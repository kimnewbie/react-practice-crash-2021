import React, {useState, useEffect} from 'react';
import AddTask from './components/AddTask';
import Header from './components/Header';
import Tasks from './components/Tasks';

const App = () => {
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
          const tasksFromServer = await fetchTasks()
          setTasks(tasksFromServer)
        }
        getTasks()
    }, [])

    // Fetch Tasks
    const fetchTasks = async () => {
        const res = await fetch('http://localhost:5000/tasks')
        const data = await res.json()

        // console.log(data)
        return data
    }
    // Add Task
    const addTask = (task) => {
        // console.log(task)
        const id = Math.floor(Math.random() * 10000) + 1
        // console.log(id)
        const newTask = {
            id,
            ...task
        }
        setTasks([
            ...tasks,
            newTask
        ])
    }

    // Delete Task
    const deleteTask = (id) => {      
        // console.log('delete', id)
        setTasks(tasks.filter((task) => task.id !== id))
    }

    // Toggle Reminder
    const toggleReminder = (id) => {
        // console.log(id)
        setTasks(tasks.map(
            (task) => task.id === id
                ? {
                    ...task,
                    reminder: !task.reminder
                }
                : task
        ))
    }

    return (
        <div className="container">
            <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/> {showAddTask && <AddTask onAdd={addTask}/>}
            {
                tasks.length > 0
                    ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>)
                    : ('No Tasks To Show')
            }
        </div>
    );
}

export default App;
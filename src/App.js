import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import About from './components/About';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
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

    // Fetch Task
    const fetchTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`)
        const data = await res.json()

        // console.log(data)
        return data
    }

    // Add Task
    const addTask = async (task) => {
        // server 연결! db.json에 실제로 추가
        const res = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        const data = await res.json()

        setTasks([
            ...tasks,
            data
        ])
        /*
        // 로컬 부분
        const id = Math.floor(Math.random() * 10000) + 1
        const newTask = { id, ...task }
        setTasks([ ...tasks, newTask ])
        */
    }

    // Delete Task
    const deleteTask = async (id) => {
        // 서버 넣은 뒤, 수정 부분. 진짜 지워지는 부분
        await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})
        //console.log('delete', id)
        setTasks(tasks.filter((task) => task.id !== id))
    }

    // Toggle Reminder
    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id)
        const updTask = {
            ...taskToToggle,
            reminder: !taskToToggle.reminder
        }

        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updTask)
        })

        const data = await res.json()

        setTasks(tasks.map(
            (task) => task.id === id
                ? {
                    ...task,
                    reminder: data.reminder
                }
                : task
        ))
        /*
        // Local
        setTasks(tasks.map(
            (task) => task.id === id
                ? { ...task, reminder: !task.reminder } : task
        ))
        */
    }

    return (
        <Router>

            <div className="container">
                <Route
                    path='/'
                    exact="exact"
                    render={(props) => (
                      <> 
                        <Header 
                          onAdd = { () => setShowAddTask(!showAddTask) }
                          showAdd = { showAddTask } 
                        /> 
                        {
                            showAddTask && <AddTask onAdd={addTask}/>
                        } 
                        {
                            tasks.length > 0
                                ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>)
                                : ('No Tasks To Show')
                        } 
                      </>
                    )}/>
                <Route path='/about' component={About}/>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
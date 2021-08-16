import Task from './Task';

const Tasks = ({tasks, onDelete, onToggle}) => {

    return (
        <div>
            {
                tasks.map((task) => (
                    // <h3 key={task.id}>{task.text}</h3>
                    <Task key={task.id} task={task} onDelete={onDelete} onToggle={onToggle}/>
                ))
            }
        </div>
    )
}

export default Tasks

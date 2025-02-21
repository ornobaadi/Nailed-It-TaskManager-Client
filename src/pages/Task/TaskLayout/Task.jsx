import { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Navbar from '../../../shared/Navbar';
import TaskColumn from '../Board/TaskColumn';
import EditTaskModal from '../Board/EditTaskModal';

const Task = () => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState('light');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  // Handle adding a new task
  const handleAddTask = async (newTask) => {
    if (!user?.email) return;

    const taskToSave = {
      ...newTask,
      email: user.email,
    };

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const { task: savedTask } = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle editing a task
  const handleEditTask = async (updatedTask) => {
    if (!user?.email) return;

    const taskToUpdate = {
      ...updatedTask,
      email: user.email,
    };

    try {
      const response = await fetch(`http://localhost:5000/tasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? taskToUpdate : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Filter tasks by user and category
  const filterTasksByUser = useMemo(() => {
    if (!user || !user.email) {
      return { todoTasks: [], inProgressTasks: [], doneTasks: [] };
    }

    const userTasks = tasks.filter((task) => task.email === user.email);
    return {
      todoTasks: userTasks.filter((task) => task.category === 'To-Do'),
      inProgressTasks: userTasks.filter((task) => task.category === 'In Progress'),
      doneTasks: userTasks.filter((task) => task.category === 'Done'),
    };
  }, [tasks, user]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-base-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-base-200/50">
              <TaskColumn
                title="To-Do"
                tasks={filterTasksByUser.todoTasks}
                containerId="todoTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
              />
              <TaskColumn
                title="In Progress"
                tasks={filterTasksByUser.inProgressTasks}
                containerId="inProgressTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
              />
              <TaskColumn
                title="Done"
                tasks={filterTasksByUser.doneTasks}
                containerId="doneTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </DndContext>
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditTask}
        />
      )}
    </div>
  );
};

export default Task;

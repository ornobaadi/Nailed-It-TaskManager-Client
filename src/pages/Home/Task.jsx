import { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Sidebar from '../Task/Sidebar/Sidebar';
import BoardHeader from '../Task/Board/BoardHeader';
import TaskColumn from '../Task/Board/TaskColumn';
import TaskCard from '../Task/Board/TaskCard';
import EditTaskModal from '../Task/Board/EditTaskModal'; // Import the EditTaskModal

const Task = () => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState('light');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
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
    console.log('Updated Task Data:', updatedTask);

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

  // Handle drag-and-drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const sourceContainer = active.data.current.container;
    const destinationContainer = over.data.current.container;

    if (sourceContainer !== destinationContainer) {
      const categoryMap = {
        todoTasks: 'To-Do',
        inProgressTasks: 'In Progress',
        doneTasks: 'Done',
      };

      const newCategory = categoryMap[destinationContainer];
      const taskId = active.id;

      // Update task category in the backend
      updateTaskCategory(taskId, newCategory);
    }

    setActiveId(null);
    setActiveTask(null);
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
      <Sidebar user={user} theme={theme} onThemeChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoardHeader onAddTask={handleAddTask} />
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="flex-1 grid grid-cols-3 gap-6 p-6 bg-base-200/50">
              <TaskColumn
                title="To-Do"
                tasks={filterTasksByUser.todoTasks}
                containerId="todoTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask} // Pass delete handler
              />
              <TaskColumn
                title="In Progress"
                tasks={filterTasksByUser.inProgressTasks}
                containerId="inProgressTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask} // Pass delete handler
              />
              <TaskColumn
                title="Done"
                tasks={filterTasksByUser.doneTasks}
                containerId="doneTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask} // Pass delete handler
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
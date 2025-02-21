import { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Navbar from '../../../shared/Navbar';
import TaskColumn from '../Board/TaskColumn';
import EditTaskModal from '../Board/EditTaskModal';
import TaskCard from '../Board/TaskCard';

const Task = () => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState('light');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

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

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    const draggedTask = tasks.find(task => task._id.toString() === active.id.toString());
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  // Handle drag over
  const handleDragOver = (event) => {
    // Not used in this implementation, but could be used for additional
    // visual feedback or advanced dragging behaviors
  };

  // Handle drag end event
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!active || !over) return;

    // Find the containers
    const activeContainer = active.data.current?.container;
    const overContainer = over.data.current?.container;
    
    // If dragging to a different container
    if (activeContainer !== overContainer) {
      // Find the active task
      const taskId = active.id;
      const taskToUpdate = tasks.find(t => t._id.toString() === taskId.toString());
      
      if (!taskToUpdate) return;
      
      // Determine the new category based on the container
      let newCategory;
      if (overContainer === 'todoTasks') newCategory = 'To-Do';
      else if (overContainer === 'inProgressTasks') newCategory = 'In Progress';
      else if (overContainer === 'doneTasks') newCategory = 'Done';
      else return;
      
      // Update the task with the new category
      const updatedTask = { ...taskToUpdate, category: newCategory };
      
      // Update in the backend
      try {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
          throw new Error('Failed to update task category');
        }

        // Update locally
        setTasks(prev => 
          prev.map(task => 
            task._id.toString() === taskId.toString() 
              ? updatedTask 
              : task
          )
        );
      } catch (error) {
        console.error('Error updating task category:', error);
      }
    } 
    // If reordering within the same container
    else if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task._id.toString() === active.id.toString());
        const newIndex = tasks.findIndex((task) => task._id.toString() === over.id.toString());
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
    
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
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-base-200/50">
              <TaskColumn
                title="To-Do"
                color="gray-400"
                tasks={filterTasksByUser.todoTasks}
                containerId="todoTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
              />
              <TaskColumn
                title="In Progress"
                color="indigo-400"
                tasks={filterTasksByUser.inProgressTasks}
                containerId="inProgressTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
              />
              <TaskColumn
                title="Done"
                color="emerald-400"
                tasks={filterTasksByUser.doneTasks}
                containerId="doneTasks"
                onAddTask={handleAddTask}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
              />
            </div>
            
            {/* Drag Overlay - shows what's being dragged */}
            <DragOverlay>
              {activeTask ? (
                <TaskCard
                  _id={activeTask._id}
                  title={activeTask.title || "Untitled Task"}
                  description={activeTask.description || ""}
                  timestamp={activeTask.timestamp || Date.now()}
                  category={activeTask.category || "Uncategorized"}
                  isDragging={true}
                />
              ) : null}
            </DragOverlay>
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
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
  MeasuringStrategy
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
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
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://nailed-it-server.vercel.app/tasks');
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

  const handleAddTask = async (newTask) => {
    if (!user?.email) return;

    const taskToSave = {
      ...newTask,
      email: user.email,
    };

    try {
      const response = await fetch('https://nailed-it-server.vercel.app/tasks', {
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

  const handleEditTask = async (updatedTask) => {
    if (!user?.email) return;

    const taskToUpdate = {
      ...updatedTask,
      email: user.email,
    };

    try {
      const response = await fetch(`https://nailed-it-server.vercel.app/tasks/${updatedTask._id}`, {
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

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://nailed-it-server.vercel.app/tasks/${taskId}`, {
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

  const handleDragStart = (event) => {
    const { active } = event;
    const draggedTask = tasks.find(task => task._id.toString() === active.id.toString());
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!active || !over) return;

    const activeContainer = active.data.current?.container;
    const overContainer = over.data.current?.container;
    
    if (activeContainer !== overContainer) {
      const taskId = active.id;
      const taskToUpdate = tasks.find(t => t._id.toString() === taskId.toString());
      
      if (!taskToUpdate) return;
      
      let newCategory;
      if (overContainer === 'todoTasks') newCategory = 'To-Do';
      else if (overContainer === 'inProgressTasks') newCategory = 'In Progress';
      else if (overContainer === 'doneTasks') newCategory = 'Done';
      else return;
      
      const updatedTask = { ...taskToUpdate, category: newCategory };
      
      try {
        const response = await fetch(`https://nailed-it-server.vercel.app/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
          throw new Error('Failed to update task category');
        }

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
    else if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task._id.toString() === active.id.toString());
        const newIndex = tasks.findIndex((task) => task._id.toString() === over.id.toString());
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
    
    setActiveTask(null);
  };

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
    <div className="w-full bg-base-100">
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToWindowEdges]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            {/* Simple main container with no special positioning */}
            <div className="w-full bg-base-200/50 p-4">
              <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
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
              </div>
            </div>
            
            {/* Standard DragOverlay, no special z-index */}
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

      {/* Modal rendered outside of the main layout flow */}
      {editingTask && (
        <div className="fixed inset-0 overflow-auto" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="absolute inset-0 bg-black/10">
            <div className="flex items-center justify-center min-h-screen p-4">
              <EditTaskModal
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSave={handleEditTask}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
import { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Sidebar from '../Task/Sidebar/Sidebar';
import BoardHeader from '../Task/Board/BoardHeader';
import TaskColumn from '../Task/Board/TaskColumn';
import TaskCard from '../Task/Board/TaskCard';

const Task = () => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    // Fetch tasks from your JSON file
    fetch('/Tasks.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("User in context:", user?.email);
        console.log("All tasks:", data);
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      });
  }, [user]);

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Filter tasks by user email first, then by category
  const filterTasksByUser = useMemo(() => {
    if (!user || !user.email) {
      console.log("No user logged in, showing no tasks");
      return { todoTasks: [], inProgressTasks: [], doneTasks: [] };
    }
    
    const userTasks = tasks.filter(task => task.email === user.email);
    console.log("Filtered tasks for user:", userTasks);
    
    return {
      todoTasks: userTasks.filter(task => task.category === "To-Do"),
      inProgressTasks: userTasks.filter(task => task.category === "In Progress"),
      doneTasks: userTasks.filter(task => task.category === "Done")
    };
  }, [tasks, user]);

  const findTaskById = (id) => {
    return tasks.find(task => task.id.toString() === id);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const taskId = active.id;
    setActiveId(taskId);
    setActiveTask(findTaskById(taskId));
  };

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
      // Map container IDs to category names
      const categoryMap = {
        'todoTasks': 'To-Do',
        'inProgressTasks': 'In Progress',
        'doneTasks': 'Done'
      };
      
      const newCategory = categoryMap[destinationContainer];
      
      // Update task category
      const updatedTasks = tasks.map(task => {
        if (task.id.toString() === active.id) {
          return { ...task, category: newCategory };
        }
        return task;
      });

      // Update state
      setTasks(updatedTasks);
      console.log(`Moved task ${active.id} from ${sourceContainer} to ${destinationContainer}`);
      
      // In a real application, you would update your backend here
      // For example: saveTaskUpdate(active.id, { category: newCategory });
    }
    
    setActiveId(null);
    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveTask(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-base-100">
      {/* Sidebar Component */}
      <Sidebar 
        user={user} 
        theme={theme} 
        onThemeChange={handleThemeChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoardHeader />

        {/* Task Columns */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="flex-1 grid grid-cols-3 gap-6 p-6 bg-base-200/50">
              <TaskColumn 
                title="To-Do" 
                color="gray-400" 
                tasks={filterTasksByUser.todoTasks} 
                containerId="todoTasks"
              />
              
              <TaskColumn 
                title="In Progress" 
                color="indigo-500" 
                titleColor="text-indigo-700"
                tasks={filterTasksByUser.inProgressTasks} 
                containerId="inProgressTasks"
              />
              
              <TaskColumn 
                title="Done" 
                color="emerald-500" 
                titleColor="text-emerald-700"
                tasks={filterTasksByUser.doneTasks} 
                containerId="doneTasks"
              />
            </div>

            {/* Drag Overlay for smooth animation */}
            <DragOverlay adjustScale zIndex={20}>
              {activeId && activeTask ? (
                <div className="opacity-80 scale-105 shadow-xl">
                  <TaskCard
                    id={activeTask.id}
                    title={activeTask.title}
                    description={activeTask.description}
                    timestamp={activeTask.timestamp}
                    category={activeTask.category}
                    isDragging={true}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default Task;
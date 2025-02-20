import { useContext, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import Sidebar from '../Task/Sidebar/Sidebar';
import BoardHeader from '../Task/Board/BoardHeader';
import TaskColumn from '../Task/Board/TaskColumn';

const Task = () => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
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
        <div className="flex-1 grid grid-cols-3 gap-6 p-6 bg-base-200/50">
          <TaskColumn 
            title="To-Do" 
            color="gray-400" 
            tasks={[]} 
          />
          
          <TaskColumn 
            title="In Progress" 
            color="yellow-500" 
            titleColor="text-yellow-700"
            tasks={[
              { 
                id: 1, 
                title: "Homepage redesign", 
                description: "Update the landing page with new branding" 
              },
              { 
                id: 2, 
                title: "API integration", 
                description: "Connect to payment processor API" 
              }
            ]} 
          />
          
          <TaskColumn 
            title="Done" 
            color="green-500" 
            titleColor="text-green-700"
            tasks={[
              { 
                id: 3, 
                title: "User interview notes", 
                description: "Compile findings from user testing sessions",
                tags: [{ text: "Completed", color: "green" }]
              }
            ]} 
          />
        </div>
      </div>
    </div>
  );
};

export default Task;
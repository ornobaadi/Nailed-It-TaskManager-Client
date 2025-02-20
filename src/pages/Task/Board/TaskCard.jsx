const TaskCard = ({ title, description, tags = [] }) => {
    return (
      <div className="p-4 bg-white border border-gray-100 rounded-xl mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex items-center mt-3">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className={`text-xs bg-${tag.color}-100 text-${tag.color}-800 px-2 py-0.5 rounded-full`}
              >
                {tag.text}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default TaskCard;
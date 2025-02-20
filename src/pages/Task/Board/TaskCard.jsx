import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GripHorizontal, Trash2 } from 'lucide-react';

const TaskCard = ({ _id, title, description, timestamp, category, containerId, isDragging = false, onEditTask, onDeleteTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({
    id: _id.toString(),
    data: {
      container: containerId,
    },
  });

  const isCurrentlyDragging = isDragging || isSorting;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCategoryStyle = () => {
    switch (category) {
      case 'To-Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'Done':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isCurrentlyDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className="mb-3 transition-all duration-200 ease-in-out"
    >
      <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between">
          <h4
            className="font-medium cursor-pointer"
            onClick={() => onEditTask({ _id, title, description, timestamp, category })}
          >
            {title}
          </h4>
          <div className="flex items-center space-x-2">
            <div
              {...attributes}
              {...listeners}
              className="p-1 rounded cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripHorizontal size={16} />
            </div>
            <button
              onClick={() => onDeleteTask(_id)} // Handle delete
              className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-1">{description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            {formatDate(timestamp)}
          </div>

          <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryStyle()}`}>
            {category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
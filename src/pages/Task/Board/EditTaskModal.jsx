import { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { AuthContext } from '../../../providers/AuthProvider'; // Import AuthContext

const EditTaskModal = ({ task, onClose, onSave }) => {
    const { user } = useContext(AuthContext); // Access user from AuthContext
    const [taskData, setTaskData] = useState({
        title: task.title,
        description: task.description,
        category: task.category,
        email: user?.email, // Include the user's email
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!taskData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (taskData.title.length > 50) {
            newErrors.title = 'Title must be less than 50 characters';
        }

        if (taskData.description.length > 200) {
            newErrors.description = 'Description must be less than 200 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !user?.email) return; // Ensure user is logged in

        setIsSubmitting(true);

        // Create the updated task object without the _id field
        const updatedTask = {
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            email: user.email, // Include the user's email
        };

        console.log('Submitting Updated Task:', updatedTask); // Debugging: Log the updated task

        try {
            await onSave({
                ...updatedTask,
                _id: task._id, // Pass the _id separately for identification
            });
        } catch (error) {
            console.error('Error updating task:', error);
            setErrors((prev) => ({
                ...prev,
                server: 'Failed to update task. Please try again.',
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-3xl bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-lg w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit Task</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-base-200 transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {errors.server && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {errors.server}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={taskData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {taskData.title.length}/50 characters
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            placeholder="Enter task description (optional)"
                            rows="4"
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {taskData.description.length}/200 characters
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-sm font-medium">Category</label>
                        <select
                            name="category"
                            value={taskData.category}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
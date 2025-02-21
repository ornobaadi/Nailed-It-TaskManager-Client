import { useState, useContext } from "react";
import { X } from "lucide-react";
import { AuthContext } from "../../../providers/AuthProvider";

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
    const { user } = useContext(AuthContext);
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        category: "To-Do",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal closes
    const resetForm = () => {
        setTaskData({
            title: "",
            description: "",
            category: "To-Do",
        });
        setErrors({});
    };

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
        if (!taskData.title.trim()) newErrors.title = "Title is required";
        if (taskData.title.length > 50)
            newErrors.title = "Title must be under 50 characters";
        if (taskData.description.length > 200)
            newErrors.description = "Description must be under 200 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !user?.email) return;

        setIsSubmitting(true);

        const newTask = {
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            email: user.email,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch("https://nailed-it-server.vercel.app/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Failed to save task");

            const savedTask = await response.json();

            if (typeof onAddTask === "function") {
                onAddTask(savedTask);
            }

            resetForm();
            onClose();
        } catch (error) {
            console.error("Error saving task:", error);
            setErrors((prev) => ({ ...prev, server: "Failed to add task." }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Add New Task</h2>
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="p-1 rounded-full hover:bg-gray-200"
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                errors.title ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            placeholder="Enter task description (optional)"
                            rows="4"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                errors.description ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-sm font-medium">
                            Category
                        </label>
                        <select
                            name="category"
                            value={taskData.category}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Add Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;

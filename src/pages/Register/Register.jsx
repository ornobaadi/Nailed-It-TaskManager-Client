import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import SocialLogin from "../../shared/SocialLogin";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
    const axiosPublic = useAxiosPublic()
    const { createNewUser, setUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        photo: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (formData.name.length < 5) {
            newErrors.name = 'Name must be at least 5 characters';
        }
        
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password)) {
            newErrors.password = 'Include both uppercase and lowercase letters';
        }
        
        if (formData.photo && !formData.photo.startsWith('http')) {
            newErrors.photo = 'Enter a valid URL starting with http:// or https://';
        }
        
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        setIsLoading(true);
    
        createNewUser(formData.email, formData.password)
            .then(result => {
                setUser(result.user);
                return updateUserProfile({ 
                    displayName: formData.name, 
                    photoURL: formData.photo 
                }).then(() => result.user);
            })
            .then(user => {
                const newUser = {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                    createdAt: new Date().toISOString()
                };
    
                return axiosPublic.post('/users', newUser);
            })
            .then(res => {
                if (res.data.insertedId) {
                    navigate("/", { state: { registrationSuccess: true } });
                }
            })
            .catch((error) => {
                let errorMessage = "Registration failed";
                switch (error.code) {
                    case "auth/email-already-in-use":
                        errorMessage = "Email already registered";
                        break;
                    case "auth/weak-password":
                        errorMessage = "Password is too weak";
                        break;
                    case "auth/invalid-email":
                        errorMessage = "Invalid email address";
                        break;
                    case "auth/network-request-failed":
                        errorMessage = "Network error. Please check your connection";
                        break;
                    default:
                        errorMessage = error.message;
                }
                setError({ ...error, auth: errorMessage });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const getPasswordStrength = () => {
        if (!formData.password) return 0;
        
        let strength = 0;
        if (formData.password.length >= 6) strength += 1;
        if (formData.password.length >= 10) strength += 1;
        if (/[A-Z]/.test(formData.password)) strength += 1;
        if (/[a-z]/.test(formData.password)) strength += 1;
        if (/[0-9]/.test(formData.password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
        
        return Math.min(strength, 5);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-6 text-center py-5">
                    <h2 className="text-2xl font-bold text-indigo-600">Create Account</h2>
                    <p className="text-gray-600 mt-1 text-sm">Sign up to get started with your workspace</p>
                </div>
                
                {error.auth && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-4">
                        {error.auth}
                    </p>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
                            placeholder="John Doe"
                        />
                        {error.name && (
                            <p className="mt-1 text-xs text-red-600">{error.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                            Profile photo URL
                        </label>
                        <input
                            id="photo"
                            name="photo"
                            type="text"
                            value={formData.photo}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
                            placeholder="https://example.com/photo.jpg"
                        />
                        {error.photo && (
                            <p className="mt-1 text-xs text-red-600">{error.photo}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                        {formData.password && (
                            <div className="mt-2 space-y-1">
                                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${
                                            getPasswordStrength() <= 1 ? 'bg-red-500' : 
                                            getPasswordStrength() <= 2 ? 'bg-orange-500' : 
                                            getPasswordStrength() <= 3 ? 'bg-yellow-500' : 
                                            'bg-green-500'
                                        }`}
                                        style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                                    ></div>
                                </div>
                                {error.password && (
                                    <p className="text-xs text-red-600">{error.password}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn bg-gradient-to-r from-purple-500 to-indigo-600  text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        {isLoading ? (
                            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Create account"
                        )}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <SocialLogin />
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
import { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import SocialLogin from "../../shared/SocialLogin";

const Login = () => {
    const { userLogin, setUser } = useContext(AuthContext)
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const emailRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError({});
        
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        
        userLogin(email, password)
            .then((result) => {
                setUser(result.user);
                navigate(location?.state?.from || '/', { replace: true });
            })
            .catch((err) => {
                const errorMessage = 
                    err.code === 'auth/invalid-credential' ? 'Invalid email or password' :
                    err.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later' :
                    'Login failed';
                    
                setError({ ...error, login: errorMessage });
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-6 text-center py-5">
                    <h2 className="text-2xl font-bold text-indigo-600">Welcome Back</h2>
                    <p className="text-gray-600 mt-1 text-sm">Sign in to continue to your workspace</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            ref={emailRef}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {error.login && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error.login}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        {isLoading ? (
                            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Sign in"
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
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
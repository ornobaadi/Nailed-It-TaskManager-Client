import { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
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

    const handleForgetPassword = () => {
        navigate("/auth/forget-password", { state: { email: emailRef.current?.value || "" } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-medium text-gray-900 mb-8">Sign in</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
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
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={handleForgetPassword}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error.login && (
                        <p className="text-sm text-red-600">
                            {error.login}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
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

                    <SocialLogin></SocialLogin>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
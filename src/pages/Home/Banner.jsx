import Lottie from 'lottie-react';
import banner from "../../../public/banner.json"
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <section className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
            <div className="inter-tight max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col items-center space-y-12">
                    {/* Text Content */}
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Organize Your Work Seamlessly
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            Stay on top of your projects with our intuitive task management app.
                            Prioritize, track progress, and collaborate effortlessly.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/login" className="btn bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-none btn-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                Start Managing
                            </Link>
                        </div>
                    </div>

                    {/* Lottie Animation Container */}
                    <div className=" rounded-2xl backdrop-blur-sm">
                        <div className="relative rounded-lg overflow-hidden">
                            <Lottie className='w-[300px] md:w-[400px]' animationData={banner} loop={true} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {


	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const {login, isLoading, error, isForgotPasswordClicked, setIsForgotPasswordClicked, API_URL} = useAuthStore();
	console.log(isForgotPasswordClicked)
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try{

			await login(email, password);
			navigate("/dashboard")

		}
		catch(error){

			console.log("Error Logging In", error);
		}

	};

	const handleForgotPassword = async()=>{

		await setIsForgotPasswordClicked(true);
		navigate("/forgot-password")

	}
	const handleGoogleLogin = () => {
    
		window.open(`${API_URL}/api/auth/google`, "_self");
	
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8 flex flex-col items-center justify-center w-full'>
				
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r w-full from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Welcome Back
				</h2>

				<form onSubmit={handleLogin} className="w-full">
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
                        autoComplete="true"
						onChange={(e) => setPassword(e.target.value)}
					/>

					<div className='flex items-center mb-6'>
						<Link onClick={handleForgotPassword} className='text-sm text-green-400 hover:underline'>
							Forgot password?
						</Link>
					</div>
					
					{error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						
					>
                        {isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Login"}

					</motion.button>

                    <div className='text-gray-400 flex flex-col  items-center justify-center mt-5'>

                        <p>You can Login With</p>

                        <div className='flex items-center justify-center'>

                            <button
                                onClick={handleGoogleLogin}
                                className="mt-2 flex items-center justify-center bg-white text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
                            >
                                
                                Google
                            </button>

                        </div>

                    </div>

				</form>
				
			</div>

			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-green-400 hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default LoginPage;
import React, {useState, useEffect}from 'react'
import {motion} from "framer-motion"
import { Loader, Lock, Mail, User } from "lucide-react";
import Input from '../components/Input';
import { Link } from 'react-router-dom';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signup, error, isLoading, user, API_URL} = useAuthStore();
    const navigate = useNavigate();

    console.log(user)
    const handleSignUp = async (e) =>{

        e.preventDefault();

        try{

            await signup(email, password, name);
            navigate("https://authentication-system-frontend-taupe.vercel.app/verify-email");


        }

        catch(error){

        console.log(error);

        }

    }

    const handleGoogleSignup = () => {
        
        window.open(`${API_URL}/api/auth/google`, "_self");

    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
                

                <div className="p-8">

                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        
                        Create Account
                        
                    </h2>

                    <form onSubmit={handleSignUp}>

                        <Input
                        
                        icon={User}
                        type='text'
                        placeholder='Full Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                        />

                        <Input
                        
                        icon={Mail}
                        type='email'
                        placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username" 

                        />

                        <Input
                        
                        icon={Lock}
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"

                        />

                        {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                            
                        <PasswordStrengthMeter password={password}/>

                        <motion.button
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-green-600
                        hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled = {isLoading}
                        >
                        {isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
                                </motion.button>


                    </form>

                </div>

                <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center'>
                
                    <div className=''>

                        <p className='text-sm text-gray-400'>
                        Already have an account?{" "}
                        <Link to={"/login"} className='text-green-400 hover:underline'>
                            Login
                        </Link>

                        </p>

                    </div>

                    <div className='text-gray-400 flex flex-col '>

                        <p>You can SignIn With</p>

                        <div className='flex items-center justify-center'>

                        <button
                            onClick={handleGoogleSignup}
                            className="mt-2 flex items-center justify-center bg-white text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
                        >
                            
                            Google
                        </button>

                        </div>

                    </div>

                </div>

                
            
            
            </motion.div>
        </>
    )
}

export default SignUpPage

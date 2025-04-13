import React, { useEffect } from 'react';
import FloatingShape from './components/FloatingShape';
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import LoginPage from './Pages/LoginPage.jsx';
import SignUpPage from './Pages/SignUpPage.jsx';
import EmailVerificationPage from './Pages/EmailVerificationPage.jsx';
import { useAuthStore } from './store/authStore.js';
import DashboardPage from "./Pages/DashboardPage.jsx";
import HomePage from './Pages/HomePage.jsx';
import ForgotPasswordPage from './Pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './Pages/ResetPasswordPage.jsx';


const App = () => {
    
    const { checkAuth, isCheckingAuth, user, isAuthenticated, isForgotPasswordClicked } = useAuthStore();

    console.log(user, isAuthenticated)
    useEffect(() => {

        checkAuth(); // Check authentication status on app initialization
    }, []);

    if(isCheckingAuth){

        return <div>Loading...</div>; // Show loading state while checking auth
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
            <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
            <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
            <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />

            <Routes>
                <Route path="/" element={<HomePage />} />

                
                <Route path="/dashboard" element={user && isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />

                
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={isForgotPasswordClicked ?<ForgotPasswordPage />: <Navigate to="/login"/>} />

                <Route path='/reset-password/:token' element={<ResetPasswordPage />}/>
                <Route path="*" element={<HomePage />} />
                <Route path="/verify-email" element={user && !(user.isVerified) ?<EmailVerificationPage />: <Navigate to="/signup"/>} />


            </Routes>

        </div>
    );
};

export default App;

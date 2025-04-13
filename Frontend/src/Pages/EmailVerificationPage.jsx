import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const EmailVerificationPage = () => {
    
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef(Array(6).fill(null)); // Ensure proper ref array
    const navigate = useNavigate();
    const { error, isLoading, verifyEmail, user } = useAuthStore();
    

    const handleChange = (index, value) => {
        const newCode = [...code];

        if (value.length > 1) {
            // Handle pasted content
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);

            // Move focus to last filled or first empty input
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex]?.focus();
        } else {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to next input if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");

        console.log("Submitting verification code:", verificationCode);

        try{

            const success = await verifyEmail(verificationCode);
            if(success){
				
                navigate("/dashboard");
            }
        } 
		
		catch (error) {
            console.log("Verification failed:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            
			<motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Verify Your Email
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Enter the 6-digit code sent to your email address.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
					<div className="flex justify-between">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                            />
                        ))}

                    </div>

                    {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </motion.button>

                </form>

            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;

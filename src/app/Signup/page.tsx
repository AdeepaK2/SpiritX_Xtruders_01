"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Add this import

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false); // Add this state
    const router = useRouter();
    
    // Validation states
    const [errors, setErrors] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        terms: "",
        form: "",
        passwordRequirements: {
            minLength: false,
            upperCase: false,
            lowerCase: false,
            specialChar: false
        }
    });

    // Password strength indicator
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: "",
        color: "bg-gray-200"
    });

    // Real-time validation for full name
    useEffect(() => {
        if (fullName) {
            if (fullName.trim().length < 2) {
                setErrors(prev => ({
                    ...prev,
                    fullName: "Full name is too short"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    fullName: ""
                }));
            }
        }
    }, [fullName]);

    // Real-time validation for username
    useEffect(() => {
        if (username) {
            if (username.length < 8) {
                setErrors(prev => ({
                    ...prev,
                    username: "Username must be at least 8 characters long"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    username: ""
                }));
                
                // Here you would typically check username uniqueness against the server
                // This is just a placeholder for the real implementation
                // checkUsernameUniqueness(username);
            }
        }
    }, [username]);

    // Password validation and strength checking
    useEffect(() => {
        if (!password) {
            setPasswordStrength({
                score: 0,
                message: "",
                color: "bg-gray-200"
            });
            setErrors(prev => ({...prev, password: ""}));
            return;
        }

        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        // Update password requirements
        setErrors(prev => ({
            ...prev,
            passwordRequirements: {
                minLength: isLongEnough,
                upperCase: hasUpperCase,
                lowerCase: hasLowerCase,
                specialChar: hasSpecialChar
            }
        }));

        // Calculate strength score
        let score = 0;
        if (isLongEnough) score += 1;
        if (hasUpperCase) score += 1;
        if (hasLowerCase) score += 1;
        if (hasNumber) score += 1;
        if (hasSpecialChar) score += 1;

        const strengthMap = [
            { message: "Very weak", color: "bg-red-500" },
            { message: "Weak", color: "bg-orange-500" },
            { message: "Medium", color: "bg-yellow-500" },
            { message: "Strong", color: "bg-blue-500" },
            { message: "Very strong", color: "bg-green-500" }
        ];

        setPasswordStrength({
            score,
            message: strengthMap[score - 1]?.message || "",
            color: strengthMap[score - 1]?.color || "bg-gray-200"
        });

        // Password validation
        if (!isLongEnough || !hasLowerCase || !hasUpperCase || !hasSpecialChar) {
            setErrors(prev => ({
                ...prev,
                password: "Please meet all password requirements"
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                password: ""
            }));
        }
    }, [password]);

    // Real-time confirm password validation
    useEffect(() => {
        if (confirmPassword) {
            if (password !== confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: "Passwords do not match"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ""
                }));
            }
        }
    }, [confirmPassword, password]);

    // Real-time terms agreement validation
    useEffect(() => {
        if (!agreeToTerms) {
            setErrors(prev => ({
                ...prev,
                terms: "You must agree to the Terms and Conditions"
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                terms: ""
            }));
        }
    }, [agreeToTerms]);

    // Complete form validation before submission
    const validateForm = () => {
        const newErrors = {
            fullName: "",
            username: "",
            password: "",
            confirmPassword: "",
            terms: "",
            form: "",
            passwordRequirements: errors.passwordRequirements || {
                minLength: false,
                upperCase: false,
                lowerCase: false,
                specialChar: false
            }
        };
        
        let isValid = true;

        // Full name validation
        if (!fullName.trim()) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = "Full name is too short";
            isValid = false;
        }

        // Username validation
        if (!username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (username.length < 8) {
            newErrors.username = "Username must be at least 8 characters long";
            isValid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else {
            const hasLowerCase = /[a-z]/.test(password);
            const hasUpperCase = /[A-Z]/.test(password);
            const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
            const isLongEnough = password.length >= 8;
            
            // Update requirements status
            newErrors.passwordRequirements = {
                minLength: isLongEnough,
                upperCase: hasUpperCase,
                lowerCase: hasLowerCase,
                specialChar: hasSpecialChar
            };
            
            if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasSpecialChar) {
                newErrors.password = "Please meet all password requirements";
                isValid = false;
            }
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        // Terms agreement validation
        if (!agreeToTerms) {
            newErrors.terms = "You must agree to the Terms and Conditions";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Call the actual API endpoint
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullName,
                    username: username,
                    password: password
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                // Handle API error responses
                if (response.status === 409) {
                    toast.error("Username already exists");
                    setErrors(prev => ({
                        ...prev,
                        username: "Username already exists"
                    }));
                } else if (response.status === 400 && data.details) {
                    // Password validation failed
                    toast.error("Password doesn't meet security requirements");
                    setErrors(prev => ({
                        ...prev,
                        password: "Password doesn't meet security requirements"
                    }));
                } else {
                    throw new Error(data.error || "Registration failed");
                }
                return;
            }
            
            // Show success dialog instead of just a toast
            setShowSuccessDialog(true);
            
            // Wait 2 seconds before redirecting
            setTimeout(() => {
                router.push('/Login');
            }, 2000);
            
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error("Registration failed. Please try again later.");
            setErrors(prev => ({
                ...prev,
                form: "An unexpected error occurred. Please try again."
            }));
        } finally {
            setIsLoading(false);
        }
    };

    // Add this new function
    const handleGoogleSignIn = async () => {
        toast.loading("Connecting to Google...", {
            id: "google-signin",
        });
        
        setIsLoading(true);
        try {
            await signIn('google', { 
                callbackUrl: '/',
                redirect: true
            });
        } catch (error) {
            console.error("Google signup failed:", error);
            toast.error("Google signup failed. Please try again.");
            toast.dismiss("google-signin");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Toast container */}
            <Toaster />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md bg-base-100 shadow-xl"
            >
                <div className="card-body p-8">
                    <div className="flex flex-col items-center mb-8">
                        <h2 className="card-title text-3xl font-bold text-center mb-2">Create Account</h2>
                        <p className="text-sm opacity-70 text-center">Sign up to get started</p>
                    </div>

                    {errors.form && (
                        <div className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{errors.form}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${errors.fullName ? 'input-error' : ''}`}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            {errors.fullName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.fullName}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="johndoe123"
                                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${errors.username ? 'input-error' : ''}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.username}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`input input-bordered w-full pr-10 focus:input-primary transition-all duration-200 ${errors.password ? 'input-error' : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password}</span>
                                </label>
                            )}
                            
                            {/* Password strength indicator */}
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className={`h-2.5 rounded-full ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs mt-1">{passwordStrength.message}</p>
                                </div>
                            )}
                            
                            {/* Password requirements checklist */}
                            {password.length > 0 && (
                                <div className="mt-2 text-xs space-y-1">
                                    <p className="font-medium">Password requirements:</p>
                                    <ul className="space-y-1 pl-1">
                                        <li className={`flex items-center gap-1 ${errors.passwordRequirements?.minLength ? 'text-success' : 'text-error'}`}>
                                            {errors.passwordRequirements?.minLength ? '✓' : '•'} At least 8 characters
                                        </li>
                                        <li className={`flex items-center gap-1 ${errors.passwordRequirements?.upperCase ? 'text-success' : 'text-error'}`}>
                                            {errors.passwordRequirements?.upperCase ? '✓' : '•'} One uppercase letter
                                        </li>
                                        <li className={`flex items-center gap-1 ${errors.passwordRequirements?.lowerCase ? 'text-success' : 'text-error'}`}>
                                            {errors.passwordRequirements?.lowerCase ? '✓' : '•'} One lowercase letter
                                        </li>
                                        <li className={`flex items-center gap-1 ${errors.passwordRequirements?.specialChar ? 'text-success' : 'text-error'}`}>
                                            {errors.passwordRequirements?.specialChar ? '✓' : '•'} One special character
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`input input-bordered w-full pr-10 focus:input-primary transition-all duration-200 ${errors.confirmPassword ? 'input-error' : ''}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                                </label>
                            )}
                        </div>
                        
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-sm checkbox-primary" 
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                />
                                <span className="label-text">I agree to the <Link href="/terms" className="text-primary hover:underline">Terms and Conditions</Link></span>
                            </label>
                            {errors.terms && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.terms}</span>
                                </label>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="divider my-6 text-xs text-gray-500">OR CONTINUE WITH</div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleGoogleSignIn}
                            type="button"
                            disabled={isLoading}
                            className="btn btn-outline btn-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FaGoogle className="text-red-500" />
                            <span>Google</span>
                        </button>
                        <button className="btn btn-outline btn-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FaFacebook className="text-blue-600" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    <p className="text-center mt-8 text-sm">
                        Already have an account?{" "}
                        <Link href="/Login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
            
            {/* Success dialog */}
            {showSuccessDialog && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-2xl"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Account Created!</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">Your account has been successfully created.</p>
                            <p className="text-sm text-gray-500">Redirecting to login page...</p>
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                                <motion.div 
                                    className="bg-primary h-1.5 rounded-full" 
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

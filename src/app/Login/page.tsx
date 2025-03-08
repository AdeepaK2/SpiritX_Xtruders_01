"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    
    // Validation states
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        form: "",
        passwordRequirements: {
            minLength: false,
            upperCase: false,
            lowerCase: false,
            specialChar: false
        }
    });

    // Real-time validation for password
    useEffect(() => {
        if (password) {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
            const hasMinLength = password.length >= 8;
            
            // Instead of a single error message, track requirements separately
            setErrors(prev => ({
                ...prev,
                password: !hasMinLength || !hasUpperCase || !hasLowerCase || !hasSpecialChar 
                    ? "Please meet all password requirements" : "",
                // Store requirements state in the component (removed number requirement)
                passwordRequirements: {
                    minLength: hasMinLength,
                    upperCase: hasUpperCase,
                    lowerCase: hasLowerCase,
                    specialChar: hasSpecialChar
                }
            }));
        }
    }, [password]);

    // Complete form validation before submission
    const validateForm = () => {
        const newErrors = {
            username: "",
            password: "",
            form: "",
            passwordRequirements: errors.passwordRequirements || {
                minLength: false,
                upperCase: false,
                lowerCase: false,
                specialChar: false
            }
        };
        
        let isValid = true;

        // Username validation
        if (!username) {
            newErrors.username = "Username is required";
            isValid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else {
            // Enhanced password validation (removed number requirement)
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
            const hasMinLength = password.length >= 8;
            
            // Update requirements status (removed number)
            newErrors.passwordRequirements = {
                minLength: hasMinLength,
                upperCase: hasUpperCase,
                lowerCase: hasLowerCase,
                specialChar: hasSpecialChar
            };
            
            if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasSpecialChar) {
                newErrors.password = "Please meet all password requirements";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Call the authentication API
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, rememberMe }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                setErrors(prev => ({
                    ...prev,
                    form: data.error || "Authentication failed"
                }));
                toast.error(data.error || "Login failed. Please try again.");
                return;
            }
            
            // Store session data (you might want to use a more secure method or state management like Context API)
            if (rememberMe) {
                localStorage.setItem('sessionId', data.sessionId);
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                // For session-only storage
                sessionStorage.setItem('sessionId', data.sessionId);
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }
            
            console.log("Login successful!");
            
            // Add success notification
            toast.success("Login successful!", {
                duration: 3000,
                position: "top-center",
                icon: "🎉",
            });
            
            // Wait a moment before redirecting to give the toast time to display
            setTimeout(() => {
                // Redirect to dashboard or home page after successful login
                router.push('/');
            }, 1500);
            
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed. Please try again later.");
            setErrors(prev => ({
                ...prev,
                form: "An unexpected error occurred. Please try again."
            }));
        } finally {
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
                        <h2 className="card-title text-3xl font-bold text-center mb-2">Welcome Back</h2>
                        <p className="text-sm opacity-70 text-center">Please sign in to continue</p>
                    </div>

                    {errors.form && (
                        <div className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{errors.form}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Username"
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
                            <div className="flex justify-between items-center mt-2">
                                <label className="cursor-pointer label justify-start gap-2 inline-flex">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm checkbox-primary"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <span className="label-text">Remember me</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="divider my-6 text-xs text-gray-500">OR CONTINUE WITH</div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn btn-outline btn-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FaGoogle className="text-red-500" />
                            <span>Google</span>
                        </button>
                        <button className="btn btn-outline btn-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FaFacebook className="text-blue-600" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    <p className="text-center mt-8 text-sm">
                        Don't have an account?{" "}
                        <Link href="/Signup" className="text-primary font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

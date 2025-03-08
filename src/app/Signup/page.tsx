"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    
    // Validation states
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: ""
    });

    // Password strength indicator
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: "",
        color: "bg-gray-200"
    });

    // Real-time validation for username
    useEffect(() => {
        if (name) {
            if (name.length < 8) {
                setErrors(prev => ({
                    ...prev,
                    name: "Username must be at least 8 characters long"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    name: ""
                }));
                
                // Here you would typically check username uniqueness against the server
                // This is just a placeholder for the real implementation
                // checkUsernameUniqueness(name);
            }
        }
    }, [name]);

    // Real-time validation for email
    useEffect(() => {
        if (email) {
            if (!/\S+@\S+\.\S+/.test(email)) {
                setErrors(prev => ({
                    ...prev,
                    email: "Email is invalid"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    email: ""
                }));
            }
        }
    }, [email]);

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

        // Real-time password validation
        let passwordError = "";
        if (!isLongEnough) {
            passwordError = "Password must be at least 8 characters long";
        } else if (!hasLowerCase) {
            passwordError = "Password must contain at least one lowercase letter";
        } else if (!hasUpperCase) {
            passwordError = "Password must contain at least one uppercase letter";
        } else if (!hasSpecialChar) {
            passwordError = "Password must contain at least one special character";
        } else if (score < 3) {
            passwordError = "Password is too weak";
        }

        setErrors(prev => ({
            ...prev,
            password: passwordError
        }));
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
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: ""
        };
        
        let isValid = true;

        // Username validation
        if (!name.trim()) {
            newErrors.name = "Username is required";
            isValid = false;
        } else if (name.length < 8) {
            newErrors.name = "Username must be at least 8 characters long";
            isValid = false;
        }
        // Uniqueness check would be done server-side

        // Email validation
        if (!email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
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

            if (!isLongEnough) {
                newErrors.password = "Password must be at least 8 characters long";
                isValid = false;
            } else if (!hasLowerCase) {
                newErrors.password = "Password must contain at least one lowercase letter";
                isValid = false;
            } else if (!hasUpperCase) {
                newErrors.password = "Password must contain at least one uppercase letter";
                isValid = false;
            } else if (!hasSpecialChar) {
                newErrors.password = "Password must contain at least one special character";
                isValid = false;
            } else if (passwordStrength.score < 3) {
                newErrors.password = "Password is too weak";
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
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Signup attempt with:", { name, email, password, agreeToTerms });
            // Handle successful signup here
        } catch (error) {
            console.error("Signup failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${errors.name ? 'input-error' : ''}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.name}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${errors.email ? 'input-error' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.email}</span>
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
                            {password && (
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className={`h-2.5 rounded-full ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs mt-1">{passwordStrength.message}</p>
                                </div>
                            )}
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password}</span>
                                </label>
                            )}
                            <p className="text-xs mt-1 text-gray-500">Password must be at least 8 characters long, include uppercase and lowercase letters, numbers and special characters.</p>
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
                        Already have an account?{" "}
                        <Link href="/Login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

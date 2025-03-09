"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";  // Add AnimatePresence
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

// Password requirement type
type PasswordRequirements = {
  minLength: boolean;
  upperCase: boolean;
  lowerCase: boolean;
  specialChar: boolean;
};

// Form state type
type FormState = {
  username: string;
  password: string;
  rememberMe: boolean;
};

// Error state type
type ErrorState = {
  username: string;
  password: string;
  form: string;
  passwordRequirements: PasswordRequirements;
};

// Password requirements component
const PasswordRequirements = ({ requirements }: { requirements: PasswordRequirements }) => (
  <div className="mt-2 text-xs space-y-1">
    <p className="font-medium">Password requirements:</p>
    <ul className="space-y-1 pl-1">
      <li className={`flex items-center gap-1 ${requirements.minLength ? 'text-success' : 'text-error'}`}>
        {requirements.minLength ? '✓' : '•'} At least 8 characters
      </li>
      <li className={`flex items-center gap-1 ${requirements.upperCase ? 'text-success' : 'text-error'}`}>
        {requirements.upperCase ? '✓' : '•'} One uppercase letter
      </li>
      <li className={`flex items-center gap-1 ${requirements.lowerCase ? 'text-success' : 'text-error'}`}>
        {requirements.lowerCase ? '✓' : '•'} One lowercase letter
      </li>
      <li className={`flex items-center gap-1 ${requirements.specialChar ? 'text-success' : 'text-error'}`}>
        {requirements.specialChar ? '✓' : '•'} One special character
      </li>
    </ul>
  </div>
);

// Social login buttons component
const SocialLoginButtons = () => {
  const handleGoogleSignIn = async () => {
    toast.loading("Connecting to Google...", {
      id: "google-signin",
    });
    
    try {
      // Direct redirect to homepage after Google authentication
      await signIn('google', { 
        callbackUrl: '/', 
        redirect: true
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Please try again.");
      toast.dismiss("google-signin");
    }
  };

  return (
    <>
      <div className="divider my-6 text-xs text-gray-500">OR CONTINUE WITH</div>
      <div className="w-full"> {/* Changed from flex justify-center to full width container */}
        <button 
          onClick={handleGoogleSignIn}
          type="button"
          className="btn btn-outline w-full flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700" 
          /* Removed btn-sm and px-8, added w-full for consistent width */
        >
          <FaGoogle className="text-red-500" />
          <span>Google</span>
        </button>
      </div>
    </>
  );
};

// Loading overlay component
const LoadingOverlay = ({ message = "Loading..." }: { message?: string }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div 
      className="bg-base-100 rounded-xl p-8 shadow-lg flex flex-col items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            SX
          </motion.div>
        </div>
      </div>
      
      <div className="mt-6 w-48">
        <motion.div
          className="h-1 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
      
      <p className="mt-4 font-medium text-base-content">{message}</p>
    </motion.div>
  </motion.div>
);

export default function LoginPage() {
  // Form state
  const [formData, setFormData] = useState<FormState>({
    username: "",
    password: "",
    rememberMe: false,
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Add this line - NextAuth loading state
  const [isNextAuthLoading, setIsNextAuthLoading] = useState(true);
  // Add this line for initial page loading state
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // Error state
  const [errors, setErrors] = useState<ErrorState>({
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

  const router = useRouter();
  const { data: session } = useSession();

  // Update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Real-time password validation
  useEffect(() => {
    if (formData.password) {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(formData.password);
      const hasMinLength = formData.password.length >= 8;
      
      const passwordRequirements = {
        minLength: hasMinLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        specialChar: hasSpecialChar
      };
      
      setErrors(prev => ({
        ...prev,
        password: !hasMinLength || !hasUpperCase || !hasLowerCase || !hasSpecialChar 
          ? "Please meet all password requirements" : "",
        passwordRequirements
      }));
    }
  }, [formData.password]);

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors = {
      username: "",
      password: "",
      form: "",
      passwordRequirements: errors.passwordRequirements
    };
    
    let isValid = true;

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(formData.password);
      const hasMinLength = formData.password.length >= 8;
      
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

  // Form submission handler
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
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password, 
          rememberMe: formData.rememberMe 
        }),
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
      
      // Store session data
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('sessionId', data.sessionId);
      storage.setItem('user', JSON.stringify(data.user));
      
      // Success notification and redirect
      toast.success("Login successful!", {
        duration: 3000,
        position: "top-center",
        icon: "🎉",
      });
      
      setTimeout(() => router.push('/'), 1500);
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

  // Check if user is already authenticated
  const checkAuthentication = () => {
    const sessionId = localStorage.getItem('sessionId') || sessionStorage.getItem('sessionId');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (sessionId && user) {
      try {
        const userData = JSON.parse(user);
        if (userData.username) {
          setFormData(prev => ({ ...prev, username: userData.username }));
          router.push('/');
        }
      } catch (error) {
        // Clear invalid storage data
        console.error("Invalid user data in storage:", error);
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  };

  // Check authentication on component mount
  useEffect(() => {
    // Add delay before checking to allow for animation
    const initialLoadTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1800); // Show initial loading animation for 1.8 seconds
    
    // Rest of the useEffect code remains the same...
    // Check for NextAuth callback in URL (when returning from Google)
    const isAuthCallback = typeof window !== 'undefined' && 
      (window.location.search.includes('callback') || 
       window.location.search.includes('error'));
    
    // If we have a session, handle login completion
    if (session) {
      // Show success message for Google login
      if (session.user && isAuthCallback) {
        toast.success(`Welcome ${session.user.name || 'back'}!`, {
          duration: 3000,
          position: "top-center",
          icon: "🎉",
        });
      }
      
      // Save user data
      if (session.user) {
        const userData = {
          username: session.user.email || session.user.name,
          id: session.user.id || session.user.email
        };
        
        localStorage.setItem('sessionId', session.user.id || Date.now().toString());
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect to home after a short delay to show success message
        setTimeout(() => router.push('/'), 1000);
      }
      setIsNextAuthLoading(false);
    } else if (!isNextAuthLoading) {
      // Only check local storage if NextAuth has finished loading
      checkAuthentication();
    } else {
      // Set a timeout to handle the case when NextAuth is slow
      const timer = setTimeout(() => {
        setIsNextAuthLoading(false);
        checkAuthentication();
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(initialLoadTimer); // Clean up both timers
      }
    }
  }, [session, router, isNextAuthLoading]); // Add isNextAuthLoading to dependencies

  useEffect(() => {
    // Check if user is already on the login page due to a redirect
    const isRedirectingFromCallback = typeof window !== 'undefined' && 
      window.location.search.includes('callbackUrl');
    
    // If we have a session and we're not in a redirect loop
    if (session && !isRedirectingFromCallback) {
      // Save user data
      if (session.user) {
        const userData = {
          username: session.user.email || session.user.name,
          id: session.user.id || session.user.email
        };
        
        localStorage.setItem('sessionId', session.user.id || Date.now().toString());
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Don't redirect again if we're already being redirected by NextAuth
        if (window.location.pathname.includes('Login') && !window.location.search.includes('callback')) {
          router.push('/');
        }
      }
      setIsNextAuthLoading(false);
    } else if (!isNextAuthLoading) {
      checkAuthentication();
    } else {
      const timer = setTimeout(() => {
        setIsNextAuthLoading(false);
        checkAuthentication();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [session, router, isNextAuthLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster />

      {/* Loading overlay */}
      <AnimatePresence>
        {(isPageLoading || isNextAuthLoading) && (
          <LoadingOverlay message="Preparing your login..." />
        )}
        {(!isPageLoading && !isNextAuthLoading && isLoading) && (
          <LoadingOverlay message="Signing you in..." />
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: isPageLoading ? 1.8 : 0 }}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body p-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="card-title text-3xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-sm opacity-70 text-center">Please sign in to continue</p>
          </div>

          {errors.form && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
                name="username"
                placeholder="Username"
                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${errors.username ? 'input-error' : ''}`}
                value={formData.username}
                onChange={handleInputChange}
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
                  name="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 focus:input-primary transition-all duration-200 ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
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
              
              {formData.password.length > 0 && (
                <PasswordRequirements requirements={errors.passwordRequirements} />
              )}
              
              <div className="flex justify-between items-center mt-2">
                <label className="cursor-pointer label justify-start gap-2 inline-flex">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="checkbox checkbox-sm checkbox-primary"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
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

          <SocialLoginButtons />

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

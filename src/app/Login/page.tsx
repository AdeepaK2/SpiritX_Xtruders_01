"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
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
  auth: string; // Added auth-specific error field
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
    // Don't show toast since we'll show the loading overlay
    // toast.loading("Connecting to Google...", { id: "google-signin" });
    
    try {
      await signIn('google', { 
        callbackUrl: '/', 
        redirect: true
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <>
      <div className="divider my-6 text-xs text-gray-500">OR CONTINUE WITH</div>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleGoogleSignIn}
          type="button"
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
  const [isNextAuthLoading, setIsNextAuthLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  // Add theme state
  const [theme, setTheme] = useState<string>("light");
  
  // Error state
  const [errors, setErrors] = useState<ErrorState>({
    username: "",
    password: "",
    form: "", // Keep this in the type but we won't display it
    auth: "", // We'll only display this one above the button
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
    
    // Clear auth error when user starts typing again
    if (errors.auth && (name === "username" || name === "password")) {
      setErrors(prev => ({ ...prev, auth: "" }));
    }
    
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
      auth: "", // Add the missing auth property
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
    
    // Clear any previous auth errors
    setErrors(prev => ({ ...prev, auth: "" }));
    
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
        // Only set the auth error message that appears above the button
        setErrors(prev => ({
          ...prev,
          auth: data.error || "Invalid username or password"
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
      
      // Only set the auth error
      setErrors(prev => ({
        ...prev,
        auth: "Authentication failed. Please try again."
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
        clearTimeout(initialLoadTimer);
      }
    }
  }, [session, router, isNextAuthLoading]);

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

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    
    // Add page reload to ensure all theme styles are properly applied
    window.location.reload();
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

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
        className="card w-full max-w-md bg-base-100 shadow-xl relative"
      >
        {/* Theme toggle - added at top-right corner */}
        <div className="absolute top-4 right-4 z-10">
          <label className="swap swap-rotate">
            <input 
              type="checkbox" 
              className="theme-controller" 
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            {/* sun icon */}
            <svg
              className="swap-off h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            {/* moon icon */}
            <svg
              className="swap-on h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>

        <div className="card-body p-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="card-title text-3xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-sm opacity-70 text-center">Please sign in to continue</p>
          </div>

          {/* Removed the top error alert that used errors.form */}

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
            
            {/* Keep only this authentication error message above the sign-in button */}
            {errors.auth && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-lg flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mt-0.5" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium">{errors.auth}</span>
              </div>
            )}
            
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

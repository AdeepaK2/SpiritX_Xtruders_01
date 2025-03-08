"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true); // Start with loading state
    const [user, setuser] = useState("User"); // Default user
    const router = useRouter(); // Initialize the router

    // Authentication check on component mount
    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        // Check both localStorage and sessionStorage
        const sessionId = localStorage.getItem("sessionId") || sessionStorage.getItem("sessionId");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        
        if (!sessionId) {
            // No sessionId found in either storage, redirect to login
            router.push("/Login");
        } else {
            // User is authenticated
            if (storedUser) {
                try {
                    // Parse the JSON string and extract just the username
                    const userObject = JSON.parse(storedUser);
                    setuser(userObject.username || "User");
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    setuser(storedUser);
                }
            }
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Logging out...");
            
            // Clear auth state
            localStorage.removeItem("sessionId");
            localStorage.removeItem("user");
            
            // Use Next.js router to navigate to login page
            router.push("/Login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-xl">Loading...</div>
            </div>
        );
    }

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
                        <h2 className="card-title text-3xl font-bold text-center mb-2">Welcome {user}</h2>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="btn btn-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Logout"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

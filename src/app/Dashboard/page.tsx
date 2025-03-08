"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Initialize the router

    const handleLogout = async () => {
        setIsLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Logging out...");
            
            // If you have any auth state to clear, do it here
            // For example: localStorage.removeItem("token");
            
            // Use Next.js router to navigate to login page
            router.push("/Login");
        } catch (error) {
            console.error("Logout failed:", error);
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
                        <h2 className="card-title text-3xl font-bold text-center mb-2">Welcome USER</h2>
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

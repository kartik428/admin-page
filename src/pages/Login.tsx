import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Fixed admin credentials
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // store login state
            localStorage.setItem("token", "admin_logged_in");

            // redirect
            navigate("/");
        } else {
            setError("Invalid admin credentials");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin}>
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">
                            Admin Login
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>
                        {/* Button */}
                        <Button type="submit" className="w-full">
                            Login
                        </Button>

                        {/* Hint */}
                        <p className="text-xs text-gray-400 text-center">
                            Use admin@gmail.com / admin123
                        </p>

                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
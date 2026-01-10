"use client";

import { useState } from "react";
import { AuthService } from "../_services/auth.service";
import Button from "../components/button";
import Input from "../components/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
        // const loginResp = await AuthService.signIn({ email, password });
        // send credentials; backend will set an httpOnly cookie
        await AuthService.signIn({ email, password });

        // fetch the current user from the server (reads cookie)
        const user = await AuthService.user();

        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.sub.toString());
        // localStorage.setItem("userId", loginResp.id?.toString?.() ?? "");
        // localStorage.setItem("access_token", loginResp.access_token);

        if (user.role === "admin") {
            router.push("/admin/dashboard");
        } else if (user.role === "customer") {
            router.push("/customer/dashboard");
        } else if (user.role === "inventorymanager") {
            router.push("/inventorymanager/dashboard");
        } else if (user.role === "deliveryman") {
            router.push("/deliveryman/dashboard");
        } else {
            setErrors({ general: "Unknown role" });
        }
    } catch (err: any) {
      setErrors({ general: "Invalid email or password" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8"
      >
        <h2 className="text-4xl font-extrabold text-center text-indigo-500 mb-6">
          Sign In
        </h2>

        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm text-center mt-4">{errors.general}</p>
        )}

        <div className="mt-6">
          <Button text="Sign In" type="submit" />
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/signup">
            <span className="text-indigo-600 hover:underline cursor-pointer">
              Sign Up
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}
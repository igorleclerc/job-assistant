"use client";
import { useState } from "react";
import { LoginForm } from "./loginForm";
import { RegisterForm } from "./registerForm";
import { Card, CardContent } from "./ui/card";

export const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardContent>
          {isLogin ? (
            <LoginForm onRegisterClick={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onLoginClick={() => setIsLogin(true)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 
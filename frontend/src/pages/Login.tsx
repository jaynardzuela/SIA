import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/qcu-logo.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

interface LoginResponse {
  success: boolean;
  data?: { userId: number; token: string; role: string };
  message?: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = form.formState; // Destructure errors from formState

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await loginRequest(data.email, data.password);

      if (response.success && response.data) {
        const { role } = response.data;

        // Save token, role, and email to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", data.email);

        // Navigate based on role
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "teacher") {
          navigate("/teacher-dashboard");
        } else if (role === "guard") {
          navigate("/guard-dashboard");
        } else {
          throw new Error("Role not recognized.");
        }
      } else {
        throw new Error(response.message || "Login failed");
      }

      toast.success("Login successful. Welcome back!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loginRequest = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const response = await fetch(`http://localhost:5000/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Login failed");
    }

    const data = await response.json();
    return data;
  };

  return (
    <div className="container relative h-screen flex-col md:grid items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img
            src={logo}
            alt="Quezon City University Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          Quezon City University
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Education is the passport to the future, for tomorrow
              belongs to those who prepare for it today.&rdquo;
            </p>
            <footer className="text-sm">Malcolm X</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Attendance Monitoring System For Quezon City University
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <a
              href="/forgot-password"
              className="hover:text-brand underline underline-offset-4"
            >
              Forgot your password?
            </a>
          </p>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

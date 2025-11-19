// client/src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiClient"; // <-- our helper
import { Plane, Mail, Lock, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      // IMPORTANT: call the exact path your backend expects.
      // Use trailing slash if your Django URL expects it.
      const res = await apiRequest("POST", "/api/users/login/", data);

      // if backend returns 404 here, check the Request URL in Network tab
      if (!res.ok) {
        // try to get error body
        let body = {};
        try {
          body = await res.json();
        } catch (e) {
          // ignore parse errors
        }
        const msg = body.detail || body.message || `Login failed (${res.status})`;
        const err = new Error(msg);
        err.status = res.status;
        throw err;
      }

      const json = await res.json();
      return json;
    },

    onSuccess: (result) => {
      // adapt to your backend response structure
      const user = result.user || result;
      const access = result.access || result.accessToken || result.token;
      const refresh = result.refresh || result.refreshToken;

      // call your auth context to persist tokens / user
      login(user, access, refresh);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.username || user.email}!`,
      });

      // notify other windows/components and go home
      window.dispatchEvent(new Event("userChanged"));
      setLocation("/");
    },

    onError: (err) => {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => loginMutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 pt-16">
      <div className="max-w-md w-full mx-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-secondary">TravelIndia</span>
            </div>
            <CardTitle className="text-2xl font-bold text-secondary">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />

                  <Link href="/forgot-password" className="text-sm text-primary hover:text-orange-600">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-orange-600"
                  disabled={loginMutation.isLoading}
                >
                  {loginMutation.isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-muted">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">Google</Button>
                <Button variant="outline" className="w-full">Facebook</Button>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-muted">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-primary hover:text-orange-600 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;

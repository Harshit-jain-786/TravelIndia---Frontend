// client/src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient"; // preferred helper
import { API_URL } from "@/lib/config"; // fallback
import { Plane, Mail, Lock, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // network helper used by mutation
  async function doLoginRequest(payload) {
    // Use your project's apiRequest helper if available (it handles API_URL, headers, tokens etc.)
    if (typeof apiRequest === "function") {
      // NOTE: pass path WITHOUT the /api prefix if your apiRequest already prefixes API_URL/api
      // We'll call "/users/login/" (trailing slash) which Django often expects.
      const res = await apiRequest("POST", "/users/login/", payload);

      // apiRequest likely returns a fetch Response
      if (!res.ok) {
        // attempt to extract server message
        let errBody;
        try { errBody = await res.json(); } catch (e) { errBody = { detail: res.statusText }; }
        const msg = errBody?.detail || errBody?.message || JSON.stringify(errBody) || "Login failed";
        const error = new Error(msg);
        error.status = res.status;
        throw error;
      }
      return res.json();
    }

    // Fallback: direct fetch using API_URL from config
    const endpoint = `${API_URL.replace(/\/$/, "")}/users/login/`; // ensure single slash
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // use this if backend uses cookie auth or you require credentials
    });

    if (!res.ok) {
      let errBody;
      try { errBody = await res.json(); } catch (e) { errBody = { detail: res.statusText }; }
      const msg = errBody?.detail || errBody?.message || JSON.stringify(errBody) || "Login failed";
      const error = new Error(msg);
      error.status = res.status;
      throw error;
    }

    return res.json();
  }

 // inside Login component: replace loginMutation definition's mutationFn
const loginMutation = useMutation({
  mutationFn: async (data) => {
    // apiRequest should already handle API_URL, headers, etc.
    const res = await apiRequest("POST", "/api/users/login", data);
    if (!res.ok) {
      // try to parse error body
      let errMsg = "Login failed";
      try {
        const errBody = await res.json();
        errMsg = errBody.detail || errBody.message || JSON.stringify(errBody);
      } catch {}
      const error = new Error(errMsg);
      error.status = res.status;
      throw error;
    }
    return res.json();
  },
  onSuccess: (result) => {
    const user = result.user || result;
    const access = result.access || result.accessToken || result.token;
    const refresh = result.refresh || result.refreshToken;
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.firstName || user.first_name || user.username || user.email}!`,
    });
    login(user, access, refresh);
    window.dispatchEvent(new Event("userChanged"));
    setLocation("/");
  },
  onError: (error) => {
    toast({
      title: "Login Failed",
      description: error.message || "Invalid credentials",
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
            <CardTitle className="text-2xl font-bold text-secondary" data-testid="title-welcome-back">
              Welcome Back
            </CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-login">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} type="email" placeholder="Enter your email" className="pl-10" data-testid="input-email" />
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
                          <Input {...field} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pl-10 pr-10" data-testid="input-password" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" data-testid="button-toggle-password">
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
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-remember-me" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">Remember me</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Link href="/forgot-password" className="text-sm text-primary hover:text-orange-600 transition-colors">Forgot password?</Link>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-orange-600 text-white font-semibold" disabled={loginMutation.isLoading} data-testid="button-sign-in">
                  {loginMutation.isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            {/* rest of UI (social buttons + signup link) unchanged */}
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
                <Button variant="outline" className="w-full" data-testid="button-google-login">Google</Button>
                <Button variant="outline" className="w-full" data-testid="button-facebook-login">Facebook</Button>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:text-orange-600 transition-colors font-medium">Sign up</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;


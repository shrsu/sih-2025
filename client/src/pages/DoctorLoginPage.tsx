import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
import { ModeToggle } from "@/themes/mode-toggle";
import { HeartPulse, Eye, EyeOff, Stethoscope, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";

const doctorLoginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type DoctorLoginForm = z.infer<typeof doctorLoginSchema>;

function DoctorLoginPage() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { entity, setEntity } = useLoggedInEntity();

  useEffect(() => {
    if (entity?.loggedIn) {
      if (entity.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (entity.role === "pharmacist") {
        navigate("/pharmacist/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [entity, navigate]);

  const form = useForm<DoctorLoginForm>({
    resolver: zodResolver(doctorLoginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = async (values: DoctorLoginForm) => {
    const { userId, password } = values;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/login/doctor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const doctorData = {
        id: data.doctor.id,
        name: data.doctor.name,
        role: "doctor",
        loggedIn: true,
      };

      // Fixed: Use consistent localStorage key
      localStorage.setItem("nirmaya-user", JSON.stringify(doctorData));
      setEntity(doctorData);

      navigate("/doctor/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage(err.message || "Something went wrong during login");
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="relative flex w-full justify-between px-8 py-6 backdrop-blur-sm">
        <Link 
          to="/" 
          className="flex items-center gap-4 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <p className="relative font-bold border-2 text-xl rounded-xl border-primary text-primary h-12 w-12 flex justify-center items-center bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300">
              <HeartPulse className="w-6 h-6" />
            </p>
          </div>
          <p className="font-bold text-2xl text-primary bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
            Nirmay
          </p>
        </Link>
        <ModeToggle />
      </header>

      <main className="relative flex flex-col flex-1 mb-12 items-center justify-center px-4">
        {/* Main login card */}
        <div className="w-full max-w-lg mb-4 relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
          
          {/* Main card */}
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Header with icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Doctor Login
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back! Please sign in to continue
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        User ID
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            placeholder="Enter your user ID" 
                            {...field}
                            className="pl-4 pr-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 group-hover:border-emerald-400"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className="pl-4 pr-12 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 group-hover:border-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400">
                    Don't have an account?
                  </span>
                </div>
              </div>
              <Link 
                to="#" 
                className="inline-block mt-4 text-primary hover:text-emerald-600 font-medium underline underline-offset-4 transition-colors duration-200"
              >
                Sign up as a doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Pharmacist login link */}
        <div className="mt-6 text-center">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Are you a pharmacist?{" "}
              <Link 
                to="/pharmacist/login" 
                className="text-primary hover:text-emerald-600 font-medium underline underline-offset-4 transition-colors duration-200"
              >
                Login as pharmacist
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Enhanced Error Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Invalid Credentials
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {errorMessage || "The user ID or password you entered is incorrect. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={() => setShowDialog(false)}
              className="px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DoctorLoginPage;
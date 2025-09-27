import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Phone, LockKeyhole, UserRound, Eye, EyeOff, Shield, Sparkles, Home } from "lucide-react";
import { ModeToggle } from "@/themes/mode-toggle";
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";

const UserLoginPage: React.FC = () => {
  const [phone, setPhone] = useState("+91");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { entity, setEntity } = useLoggedInEntity();
  const didRedirect = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    if (entity?.loggedIn && !didRedirect.current) {
      didRedirect.current = true;

      switch (entity.role) {
        case "user":
          navigate("/user/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "pharmacist":
          navigate("/pharmacist/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }, [entity, navigate]);

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);

    try {
      // TODO: Replace this with real API call
      const userEntity = {
        id: phone,
        name: phone, // or fetch/display name from server
        role: "user",
        loggedIn: true,
      };

      setEntity(userEntity); // updates context and localStorage
      navigate("/user/dashboard"); // immediate redirect
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-br from-indigo-400/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="flex w-full justify-between items-center px-6 py-6 sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <UserRound className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Access your health records and consultation history
            </p>
          </div>
        </div>

        {/* Navbar Right Side */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
            title="Home"
          >
            <Home className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" />
          </Link>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Welcome Card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Sign in to your account
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Enter your credentials to access your health dashboard
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="+91XXXXXXXXXX"
                    className="w-full pl-14 pr-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 font-medium transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-500"
                    value={phone}
                    onChange={(e) => {
                      let v = e.target.value.replace(/[^\d+]/g, "");
                      if (!v.startsWith("+91")) {
                        v = "+91" + v.replace(/^\+?91?/, "").replace(/\D/g, "");
                      }
                      v = "+91" + v.slice(3).replace(/\D/g, "");
                      setPhone(v);
                    }}
                    maxLength={13}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Your phone number is used as your unique identifier
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-gradient-to-br from-purple-500 to-pink-600 shadow-sm">
                    <LockKeyhole className="h-4 w-4 text-white" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-14 pr-14 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 font-medium transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !phone.trim() || !password.trim()}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:via-slate-400 disabled:to-slate-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 group disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/50 mt-0.5">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                    Secure Access
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Your health data is protected with industry-standard encryption and security measures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <button className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                Forgot Password?
              </button>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <button className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                Need Help?
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New user? Contact your healthcare provider to get started.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserLoginPage;
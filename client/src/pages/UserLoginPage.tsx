import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, LockKeyhole, UserRound } from "lucide-react";
import { ModeToggle } from "@/themes/mode-toggle";

const UserLoginPage: React.FC = () => {
  const [phone, setPhone] = useState("+91");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    try {
      // Fake auth: accept any password for now
      localStorage.setItem(
        "nirmaya-customer",
        JSON.stringify({ phoneNumber: phone })
      );
      navigate("/user/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background dark:bg-gray-900 flex flex-col">
      <header className="flex w-full justify-between items-center px-6 py-4 sticky top-0 z-10 bg-card border-b shadow-sm">
        <div className="flex items-center gap-3">
          <UserRound className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              User Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your consultation summaries and prescriptions
            </p>
          </div>
        </div>
        <ModeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Phone Number (starts with +91)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="+91XXXXXXXXXX"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background dark:bg-gray-800 text-foreground"
                  value={phone}
                  onChange={(e) => {
                    let v = e.target.value;
                    // Keep only + and digits
                    v = v.replace(/[^\d+]/g, "");
                    // Ensure it starts with +91
                    if (!v.startsWith("+91")) {
                      // Remove any other leading + and digits then add +91
                      v = "+91" + v.replace(/^\+?91?/, "").replace(/\D/g, "");
                    }
                    // After +91, keep only digits
                    v = "+91" + v.slice(3).replace(/\D/g, "");
                    setPhone(v);
                  }}
                  maxLength={13}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background dark:bg-gray-800 text-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UserLoginPage;

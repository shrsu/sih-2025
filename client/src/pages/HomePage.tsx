import { ModeToggle } from "@/themes/mode-toggle";
import { Button } from "@/components/ui/button";
import { HeartPulse, Stethoscope, Pill, User, ArrowRight, Shield, Clock, Users } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link } from "react-router-dom";
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";

function HomePage() {
  const { entity } = useLoggedInEntity();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Floating medical icons */}
        <div className="absolute top-20 left-20 text-blue-200/30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <HeartPulse className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-32 text-green-200/30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Stethoscope className="w-6 h-6" />
        </div>
        <div className="absolute bottom-40 left-32 text-blue-200/30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          <Pill className="w-7 h-7" />
        </div>
        <div className="absolute bottom-20 right-20 text-teal-200/30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.2s' }}>
          <Shield className="w-6 h-6" />
        </div>
      </div>

      {/* Header */}
      <header className="relative flex w-full justify-between px-8 py-6 backdrop-blur-sm z-10">
        <Link to="/" className="flex items-center gap-4 transition-all duration-300 hover:scale-105 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <p className="relative font-bold border-2 text-xl rounded-xl border-primary text-primary h-12 w-12 flex justify-center items-center bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300">
              <HeartPulse className="w-6 h-6" />
            </p>
          </div>
          <p className="font-bold text-2xl text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Nirmay
          </p>
        </Link>

        <div className="flex gap-4 items-center">
          {/* Conditional based on login */}
          {entity?.loggedIn ? (
            <div className="flex gap-3">
              {entity.role === "doctor" && (
                <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/doctor/dashboard" className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Doctor Dashboard
                  </Link>
                </Button>
              )}
              {entity.role === "pharmacist" && (
                <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/pharmacist/dashboard" className="flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Pharmacist Dashboard
                  </Link>
                </Button>
              )}
              {entity.role === "user" && (
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/user/dashboard" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User Dashboard
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              {/* Sign Up Hover Card */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Sign Up
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl">
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="justify-start hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200">
                      <Link to="#" className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-emerald-600" />
                        Doctor Sign Up
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                      <Link to="#" className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600" />
                        Pharmacist Sign Up
                      </Link>
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* Sign In Hover Card */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" className="border-2 border-primary/50 hover:border-primary bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl">
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="justify-start hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200">
                      <Link to="/doctor/login" className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-emerald-600" />
                        Doctor Login
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                      <Link to="/pharmacist/login" className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600" />
                        Pharmacist Login
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200">
                      <Link to="/user/login" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        User Login
                      </Link>
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}

          {/* Theme toggle */}
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex flex-1 items-center justify-center px-8 text-center z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main heading */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text text-transparent mb-6 animate-fade-in">
              Nirmay
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full animate-pulse"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Revolutionizing healthcare through seamless digital connections between 
            <span className="text-emerald-600 font-semibold"> doctors</span>, 
            <span className="text-blue-600 font-semibold"> pharmacists</span>, and 
            <span className="text-cyan-600 font-semibold"> patients</span>
          </p>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Doctors card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">For Doctors</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Streamline prescriptions and patient management with our integrated platform
                </p>
              </div>
            </div>

            {/* Pharmacists card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">For Pharmacists</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Efficiently manage inventory and fulfill prescriptions with real-time updates
                </p>
              </div>
            </div>

            {/* Patients card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">For Patients</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Access your health records and prescriptions securely from anywhere
                </p>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="flex justify-center items-center gap-12 mb-12 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">Secure</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end encrypted</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">Fast</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time updates</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">Connected</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Integrated ecosystem</p>
            </div>
          </div>

          {/* CTA Button for non-logged in users */}
          {!entity?.loggedIn && (
            <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 hover:from-blue-700 hover:via-cyan-700 hover:to-green-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default HomePage;
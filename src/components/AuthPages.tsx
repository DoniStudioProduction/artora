import React, { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, Phone, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import {
  registerWithEmail,
  loginWithEmail,
  sendPasswordReset
} from "../lib/firebaseService";

interface AuthPagesProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: any) => void;
  onRegisterSuccess: (user: any) => void;
  initialMode?: "login" | "signup";
}

export default function AuthPages({ onBackToHome, onLoginSuccess, onRegisterSuccess, initialMode = "login" }: AuthPagesProps) {
  const [mode, setMode] = useState<"login" | "signup" | "role-selection">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Registered temporary user (to pass to role-selection)
  const [tempRegisteredUser, setTempRegisteredUser] = useState<any>(null);

  // Role Selection State
  const [selectedRole, setSelectedRole] = useState<"buyer" | "creator" | "both">("buyer");

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    setSignUpError("");

    if (!fullName.trim()) {
      setSignUpError("Please enter your full name.");
      return;
    }
    if (!email.includes("@")) {
      setSignUpError("Please enter a valid email address.");
      return;
    }
    if (phoneNumber.length < 7) {
      setSignUpError("Please enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setSignUpError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setSignUpError("Passwords do not match.");
      return;
    }

    const newUser = {
      name: fullName,
      email: email,
      phone: phoneNumber,
      password: password,
      role: "buyer"
    };

    setTempRegisteredUser(newUser);
    setMode("role-selection");
  };

  const handleRoleSelectionSubmit = async () => {
    if (!tempRegisteredUser) return;
    setIsLoading(true);
    setSignUpError("");
    
    try {
      const finalUser = await registerWithEmail(
        tempRegisteredUser.email,
        tempRegisteredUser.password,
        tempRegisteredUser.name,
        selectedRole,
        tempRegisteredUser.phone
      );

      onRegisterSuccess(finalUser);
    } catch (err: any) {
      setSignUpError(err.message || "An error occurred during sign up.");
      setMode("signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    if (!loginEmail.includes("@")) {
      setLoginError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your password.");
      setIsLoading(false);
      return;
    }

    try {
      const foundUser = await loginWithEmail(loginEmail, loginPassword);
      onLoginSuccess(foundUser);
    } catch (err: any) {
      setLoginError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerForgotPassword = async () => {
    if (!loginEmail.includes("@")) {
      setLoginError("Enter your email address first to receive a recovery link.");
      return;
    }
    setIsLoading(true);
    setLoginError("");
    try {
      await sendPasswordReset(loginEmail);
      setForgotSent(true);
      setTimeout(() => {
        setForgotSent(false);
      }, 5000);
    } catch (err: any) {
      setLoginError(err.message || "Could not send reset email. Verify your address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Absolute Header Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-20 px-4 sm:px-8 flex items-center justify-between border-b border-[#111111]/5 z-10 bg-[#F8F8F6]/80 backdrop-blur-sm">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-500 hover:text-[#111111] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 text-[#C9A227]" />
          <span>Back to Gallery</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <span className="font-serif text-xl tracking-[0.2em] font-bold text-[#111111]">
            ARTORA
          </span>
          <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
        </div>
      </div>

      {/* Decorative vectors */}
      <div className="absolute -left-20 top-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 mt-8">
        
        {/* VIEW 1: LOGIN */}
        {mode === "login" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-[#111111]/5 shadow-xl space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                Collector Portal
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-gray-900 font-normal">
                Welcome Back
              </h2>
              <p className="text-xs text-gray-400 font-light">
                Sign in to manage your collection and custom commissions.
              </p>
            </div>

            {/* Error alerts */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                {loginError}
              </div>
            )}

            {forgotSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium">
                An archival recovery link has been sent to your email inbox.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={triggerForgotPassword}
                    className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#C9A227] focus:ring-[#C9A227]/30 border-gray-200"
                  />
                  <span className="text-xs text-gray-500 font-light select-none">Remember Me</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] font-serif text-sm tracking-widest rounded-xl transition-all duration-300 font-bold shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Login Button</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="text-center pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-500 font-light">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[#C9A227] hover:underline font-bold"
                >
                  Create Account
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: SIGN UP */}
        {mode === "signup" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-[#111111]/5 shadow-xl space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                Join the Guild
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-gray-900 font-normal">
                Register Studio
              </h2>
              <p className="text-xs text-gray-400 font-light">
                Create a secure collector profile or prepare to open your shop.
              </p>
            </div>

            {/* Error Alerts */}
            {signUpError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                {signUpError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Julian Finch"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@artora.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] font-serif text-sm tracking-widest rounded-xl transition-all duration-300 font-bold shadow-md cursor-pointer"
              >
                Create Account
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="text-center pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-500 font-light">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#C9A227] hover:underline font-bold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: USER ROLE SELECTION */}
        {mode === "role-selection" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 border border-[#111111]/5 shadow-xl space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto border border-[#C9A227]/20">
                <Sparkles className="w-5 h-5 text-[#C9A227]" />
              </div>
              <h2 className="font-serif text-2xl text-gray-900 font-normal">
                How will you use Artora?
              </h2>
              <p className="text-xs text-gray-500 font-light max-w-sm mx-auto">
                Customize your guild experience. You can buy authentic art pieces or register as an independent creator.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Option 1: Buyer */}
              <button
                onClick={() => setSelectedRole("buyer")}
                className={`w-full p-4 rounded-2xl border text-left flex items-start space-x-4 transition-all duration-300 ${
                  selectedRole === "buyer"
                    ? "border-[#C9A227] bg-[#C9A227]/5 shadow-md"
                    : "border-gray-100 bg-gray-50 hover:bg-gray-100/50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  selectedRole === "buyer" ? "border-[#C9A227]" : "border-gray-300"
                }`}>
                  {selectedRole === "buyer" && <div className="w-2.5 h-2.5 bg-[#C9A227] rounded-full" />}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-gray-900">Buyer</h4>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed mt-1">
                    I want to explore the global registry, read creator stories, and collect rare handmade pieces.
                  </p>
                </div>
              </button>

              {/* Option 2: Creator */}
              <button
                onClick={() => setSelectedRole("creator")}
                className={`w-full p-4 rounded-2xl border text-left flex items-start space-x-4 transition-all duration-300 ${
                  selectedRole === "creator"
                    ? "border-[#C9A227] bg-[#C9A227]/5 shadow-md"
                    : "border-gray-100 bg-gray-50 hover:bg-gray-100/50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  selectedRole === "creator" ? "border-[#C9A227]" : "border-gray-300"
                }`}>
                  {selectedRole === "creator" && <div className="w-2.5 h-2.5 bg-[#C9A227] rounded-full" />}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-gray-900">Creator</h4>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed mt-1">
                    I am an independent artisan, workshop, or studio looking to list masterworks and verify my craft.
                  </p>
                </div>
              </button>

              {/* Option 3: Both */}
              <button
                onClick={() => setSelectedRole("both")}
                className={`w-full p-4 rounded-2xl border text-left flex items-start space-x-4 transition-all duration-300 ${
                  selectedRole === "both"
                    ? "border-[#C9A227] bg-[#C9A227]/5 shadow-md"
                    : "border-gray-100 bg-gray-50 hover:bg-gray-100/50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  selectedRole === "both" ? "border-[#C9A227]" : "border-gray-300"
                }`}>
                  {selectedRole === "both" && <div className="w-2.5 h-2.5 bg-[#C9A227] rounded-full" />}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-gray-900">Both</h4>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed mt-1">
                    I want the full experience — listing custom pottery or art, while also supporting other global artisans.
                  </p>
                </div>
              </button>

            </div>

            <button
              onClick={handleRoleSelectionSubmit}
              className="w-full py-3 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] font-serif text-sm tracking-widest rounded-xl transition-all duration-300 font-bold shadow-md cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Confirm Guild Role</span>
              <ShieldCheck className="w-4.5 h-4.5" />
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}

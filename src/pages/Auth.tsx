import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { BookOpen, CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Daily task logging with skill tagging",
  "Auto-compiled weekly summaries",
  "One-click professional PDF export",
  "Free for all students",
];

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters long", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (!username.trim()) {
      toast({ title: "Username required", description: "Please enter a username", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) throw error;
      toast({ title: "Success!", description: "Registration successful. Check your email for confirmation." });
      if (data.user && !data.user.email_confirmed_at) { setLoading(false); return; }
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred during sign up", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = loginIdentifier.includes("@");
      if (isEmail) {
        const { error } = await supabase.auth.signInWithPassword({ email: loginIdentifier, password });
        if (error) throw error;
        navigate("/");
        return;
      }
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", loginIdentifier)
        .single();
      if (profileError) throw new Error("Username not found");
      const { error } = await supabase.auth.signInWithPassword({ email: profileData.email, password });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred during sign in", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div
        className="hidden w-5/12 flex-col justify-center px-12 py-16 text-white md:flex"
        style={{ background: "linear-gradient(160deg,#4F46E5 0%,#3730A3 60%,#1E1B4B 100%)" }}
      >
        <div className="mb-14 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
            <BookOpen className="h-5 w-5 text-[#4F46E5]" />
          </div>
          <span className="text-xl font-extrabold">UniLog</span>
        </div>
        <h2 className="mb-4 text-3xl font-black leading-snug">
          Your Logbook,
          <br />
          <span className="text-indigo-300">Smarter.</span>
        </h2>
        <p className="mb-10 text-sm leading-relaxed text-white/75">
          Track daily tasks, compile weekly reports, and generate professional PDF logbooks for your industrial attachment.
        </p>
        <ul className="flex flex-col gap-4">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-300" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f5f5ff] px-6 py-12 md:px-10">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-[#1E1B4B]">UniLog</span>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-[#e8e8f8] bg-white p-8 shadow-[0_4px_32px_rgba(79,70,229,0.1)]">
          <h3 className="mb-1 text-2xl font-extrabold text-[#1E1B4B]">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            {tab === "login" ? "Sign in to your account" : "Start tracking your tasks for free"}
          </p>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  tab === t
                    ? "bg-white text-[#4F46E5] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="loginIdentifier" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Email or Username
                </Label>
                <Input
                  id="loginIdentifier"
                  type="text"
                  placeholder="name@example.com or johndoe"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-[#4F46E5] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:bg-[#3730A3]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="username" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="registerPassword" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Password
                </Label>
                <Input
                  id="registerPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">At least 6 characters</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-[#4F46E5] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:bg-[#3730A3]"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-gray-400">
            By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

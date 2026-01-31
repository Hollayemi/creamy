"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLoginMutation, useVerifyLoginOtpMutation } from "@/stores/services/authApi";
import { useAppDispatch } from "@/stores/hooks";
import { setCredentials } from "@/stores/slices/authSlice";
import { toast } from "sonner";

type LoginStep = "credentials" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyLoginOtpMutation();

  // Form state
  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState<any>("");
  const [phoneNumber, setPhoneNumber] = useState<any>("");

  // Handle login credentials submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    try {
      await login({
        email,
        password
      }).unwrap().then((response) => {
      setTempToken(response?.data?.otp);
      setPhoneNumber(response?.data?.phoneNumber);
      router.push('/dashboard');
      toast.success("Login successful!");
      if (response.data?.user) {
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.token ?? "",
          })
        );
      }
      })
      // setStep("otp");
      // toast.success(`OTP sent to ${response.data?.phoneNumber}`);

    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid email or password");
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      // Call OTP verification endpoint
      verifyOtp({
        phoneNumber,
        otp
      }).then((res) => {
        if (res.data?.success) {
          dispatch(
            setCredentials({
              user: res.data.data?.user,
              token: res.data.data.token,
            })
          );
          toast.success("Login successful!");
          router.push("/dashboard");

        }
      })
    
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
      setOtp("");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temp_token: tempToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("OTP resent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 p-4">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute -right-4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <div className="mb-2 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                <span className="text-2xl font-bold text-white">GK</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === "credentials" ? "Welcome Back 👋" : "Verify OTP 📱"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {step === "credentials"
                ? "Log in to continue managing your GoKart dashboard."
                : `Enter the 6-digit code sent to ${phoneNumber}`}
            </p>
          </div>

          {/* Credentials Form */}
          {step === "credentials" && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11 pr-11"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a
                  href="/auth/forgot-password"
                  className="font-medium text-purple-600 hover:text-purple-700"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-base font-semibold hover:from-purple-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          )}

          {/* OTP Verification Form */}
          {step === "otp" && (
            <div className="space-y-6">
              <button
                onClick={() => setStep("credentials")}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <Smartphone className="h-10 w-10 text-purple-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="block text-center text-sm font-medium text-gray-700">
                    Enter OTP Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      className="gap-3"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-14 w-12 text-lg" />
                        <InputOTPSlot index={1} className="h-14 w-12 text-lg" />
                        <InputOTPSlot index={2} className="h-14 w-12 text-lg" />
                        <InputOTPSlot index={3} className="h-14 w-12 text-lg" />
                        <InputOTPSlot index={4} className="h-14 w-12 text-lg" />
                        <InputOTPSlot index={5} className="h-14 w-12 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  onClick={handleOtpVerify}
                  className="h-12 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-base font-semibold hover:from-purple-700 hover:to-blue-700"
                  disabled={otp.length !== 6}
                >
                  Verify & Continue
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleResendOtp}
                      className="font-medium text-purple-600 hover:text-purple-700"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>© 2024 GoKart Admin Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
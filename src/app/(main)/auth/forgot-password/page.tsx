"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { APP_CONFIG } from "@/config/app-config";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForgotPasswordMutation } from "@/stores/services/authApi";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await forgotPassword({ email: data.email }).unwrap();

      if (response.success) {
        setEmailSent(true);
        setSentEmail(data.email);
        form.reset();
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      // Error toast is already shown by baseQuery
    }
  };

  const handleSendAnother = () => {
    setEmailSent(false);
    setSentEmail("");
    form.reset();
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Left Panel - Desktop Only */}
      <div className="bg-primary relative hidden overflow-hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" width={100} height={100} priority />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-3xl font-bold">Welcome Back</h1>
              <p className="text-primary-foreground/80 text-xl">Reset your password</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary absolute -bottom-1/4 left-[70%] h-1/2 w-full -rotate-50 md:left-1/2"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          {/* Header */}
          <div className="space-y-4 text-center">
            <Image
              src={APP_CONFIG.icon}
              alt="SON_LOGO"
              className="mx-auto block lg:hidden"
              width={70}
              height={70}
              priority
            />
            <div className="text-2xl font-bold tracking-tight">
              {emailSent ? "Check Your Email" : "Forgot Password"}
            </div>
            <div className="text-muted-foreground mx-auto max-w-xl text-sm">
              {emailSent
                ? `We've sent a password reset link to ${sentEmail}`
                : "Enter your email address and we'll send you a link to reset your password"}
            </div>
          </div>

          {/* Success State */}
          {emailSent ? (
            <div className="space-y-6">
              <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-200">Email Sent Successfully</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Please check your email inbox and spam folder for the password reset link. The link will expire in 60
                  minutes.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button className="w-full" variant="outline" onClick={handleSendAnother} type="button">
                  Send Another Email
                </Button>

                <Link href="/auth/login" className="flex items-center justify-center gap-2 py-2">
                  <ArrowLeft size={16} className="text-primary" />
                  <span className="text-primary text-sm font-medium">Back to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            autoFocus
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>

              <Link href="/auth/login" className="flex items-center justify-center gap-2 py-2">
                <ArrowLeft size={16} className="text-primary" />
                <span className="text-primary text-sm font-medium">Back to Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements - Mobile Only */}
      <div className="bg-secondary absolute -bottom-1/3 left-[65%] block h-1/2 w-full -rotate-40 md:hidden"></div>
      <div className="bg-primary absolute -bottom-1/3 left-[75%] mt-20 block h-1/2 w-full -rotate-40 md:hidden"></div>
    </div>
  );
}

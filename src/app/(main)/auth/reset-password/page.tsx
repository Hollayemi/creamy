"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APP_CONFIG } from "@/config/app-config";
import { useResetPasswordMutation } from "@/stores/services/authApi";

const FormSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    // .regex(/[0-9]/, { message: "Password must contain at least one number." })
    // .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  console.log(form.formState.errors);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const code = sessionStorage.getItem("reset_otp");
    console.log("here");
    try {
      const formData = new FormData();
      formData.append("code", code || "");
      formData.append("password", data.password);
      formData.append("password_confirmation", data.confirmPassword);

      const response = await resetPassword(formData).unwrap();
      if (response.success && response.data) {
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="bg-primary relative hidden overflow-hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" width={100} height={100} />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-3xl font-bold">Create New Password</h1>
              <p className="text-primary-foreground/80 text-sm">Set a strong password for your account</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary absolute -bottom-1/4 left-[70%] h-1/2 w-full -rotate-50 md:left-1/2"></div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" className="block: mx-auto lg:hidden" width={70} height={70} />
            <div className="text-2xl font-bold tracking-tight text-black">Reset Your Password</div>
            <div className="text-muted-foreground mx-auto max-w-xl text-sm">
              Please enter your new password. Make sure it&rsquo;s strong and secure.
            </div>
          </div>

          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-muted-foreground space-y-1 text-xs">
                  <p className="font-medium">Password requirements:</p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>At least 8 characters long</li>
                    {/* <li>Contains uppercase and lowercase letters</li>
                                        <li>Contains at least one number</li>
                                        <li>Contains at least one special character</li> */}
                  </ul>
                </div>

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            </Form>

            <Link href="/auth/login" className="flex items-center justify-center gap-4">
              <ArrowLeft size={15} className="text-primary" />
              <h5 className="text-primary text-sm">Back to Login</h5>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-secondary absolute -bottom-1/3 left-[65%] block h-1/2 w-full -rotate-40 md:hidden"></div>
      <div className="bg-primary absolute -bottom-1/3 left-[75%] mt-20 block h-1/2 w-full -rotate-40 md:hidden"></div>
    </div>
  );
}

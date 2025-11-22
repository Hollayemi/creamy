"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { APP_CONFIG } from "@/config/app-config";

const FormSchema = z.object({
  otp: z.string().min(6, { message: "Please enter the 6-digit code." }),
});

export default function OTPVerificationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    sessionStorage.setItem("reset_otp", data.otp);

    toast.success("OTP verified successfully!");
    router.push("/auth/reset-password");

    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Resending OTP...",
      success: "OTP sent successfully to your email!",
      error: "Failed to resend OTP",
    });
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="bg-primary relative hidden overflow-hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" width={100} height={100} />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-3xl font-bold">Verify Your Identity</h1>
              <p className="text-primary-foreground/80 text-sm">Enter the code we sent you</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary absolute -bottom-1/4 left-[70%] h-1/2 w-full -rotate-50 md:left-1/2"></div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" className="block: mx-auto lg:hidden" width={70} height={70} />
            <div className="text-2xl font-bold tracking-tight text-black">Enter Verification Code</div>
            <div className="text-muted-foreground mx-auto max-w-xl text-sm">
              We&rsquo;ve sent a 6-digit verification code to your email address. Please enter it below.
            </div>
          </div>

          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel className="text-center">One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Didn&rsquo;t receive the code?{" "}
                <button type="button" onClick={handleResendOTP} className="text-primary font-medium hover:underline">
                  Resend OTP
                </button>
              </p>
            </div>

            <Link href="/auth/forgot-password" className="flex items-center justify-center gap-4">
              <ArrowLeft size={15} className="text-primary" />
              <h5 className="text-primary text-sm">Back to Forgot Password</h5>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-secondary absolute -bottom-1/3 left-[65%] block h-1/2 w-full -rotate-40 md:hidden"></div>
      <div className="bg-primary absolute -bottom-1/3 left-[75%] mt-20 block h-1/2 w-full -rotate-40 md:hidden"></div>
    </div>
  );
}

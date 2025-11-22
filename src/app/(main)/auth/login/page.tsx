import { LoginForm } from "../_components/login-form";
import { APP_CONFIG } from "@/config/app-config";
import Image from "next/image";

export default function LoginERP() {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="bg-primary relative hidden overflow-hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" width={100} height={100} />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-3xl font-bold">Welcome Back</h1>
              <p className="text-primary-foreground/80 text-xl">Login to continue</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary absolute -bottom-1/4 left-[70%] h-1/2 w-full -rotate-50 md:left-1/2"></div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" className="block: mx-auto lg:hidden" width={70} height={70} />
            <div className="text-2xl font-bold tracking-tight text-black">Login</div>
            <div className="text-muted-foreground mx-auto max-w-xl text-sm">Enter your email and password</div>
          </div>
          <div className="space-y-4">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-secondary absolute -bottom-1/3 left-[65%] block h-1/2 w-full -rotate-40 md:hidden"></div>
      <div className="bg-primary absolute -bottom-1/3 left-[75%] mt-20 block h-1/2 w-full -rotate-40 md:hidden"></div>
    </div>
  );
}

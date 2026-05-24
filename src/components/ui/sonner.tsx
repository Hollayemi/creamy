"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps, toast } from "sonner"


const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "bg-white text-black border",
          title: "font-semibold",
          description: "text-sm",
        },
      }}
      // {...props}
    />
  )
}



// SUCCESS (GREEN)
export const showSuccess = (message: string, description?: string) => {
  return toast.success(message, {
    description,
    icon: <CircleCheckIcon className="size-4 text-green-600" />,
    classNames: {
      toast: "bg-green-50 border border-green-500 text-green-700",
      title: "text-green-700",
      description: "text-green-600",
    },
  });
};

// ERROR (RED)
export const showError = (message: string, description?: string) => {
  return toast.error(message, {
    description,
    icon: <OctagonXIcon className="size-4 text-red-600" />,
    position: "top-right",
    style: {
      "--normal-bg": "var(--red-50)",
      "--normal-text": "var(--red-700)",
      "--normal-border": "var(--red-500)",
    } as React.CSSProperties,
    classNames: {
      toast: "bg-red-500 border border-red-500 text-red-700",
      title: "text-red-700",
      description: "text-red-600",
    },
  });
};

export { Toaster }

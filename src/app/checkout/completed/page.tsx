"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default function OrderCompletedPage() {
  const searchParams = useSearchParams();

  const payment = searchParams.get("payment");
  const message =
    searchParams.get("message") || "Your transaction has been processed.";

  const isSuccess = payment === "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle className="text-green-500 w-16 h-16" />
          ) : (
            <XCircle className="text-red-500 w-16 h-16" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">
          {isSuccess ? "Payment Successful 🎉" : "Payment Failed ❌"}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">{decodeURIComponent(message)}</p>

        {/* Actions */}
        {/* <div className="space-y-3">
          {isSuccess ? (
            <>
              <Link
                href="/orders"
                className="block w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
              >
                View Orders
              </Link>

              <Link
                href="/"
                className="block w-full border py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Continue Shopping
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/checkout"
                className="block w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
              >
                Try Again
              </Link>

              <Link
                href="/support"
                className="block w-full border py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Contact Support
              </Link>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
}
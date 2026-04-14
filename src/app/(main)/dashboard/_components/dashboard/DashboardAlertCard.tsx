import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DashboardAlertCard() {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="relative h-52 w-full">
        <Image src="/images/megaphone.png" alt="Alerts" fill className="object-contain" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="bg-primary/10 hover:bg-primary/20 text- lg flex items-center justify-between rounded-lg px-2 py-3 transition">
          <span>You have 4 new orders coming in, check...</span>
          <ArrowRight className="text-primary h-8 w-8" />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-amber-100 px-2 py-3 text-lg transition hover:bg-amber-200">
          <span>You have 5 products that are out of stock...</span>
          <ArrowRight className="h-8 w-8 text-amber-600" />
        </div>
      </div>
    </div>
  );
}

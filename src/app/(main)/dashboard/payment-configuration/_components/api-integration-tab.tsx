"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Copy, X, Check } from "lucide-react";
import { useGetAllPaymentMethodsQuery, useTogglePaymentMutation } from "@/stores/services/paymentApi";
import { PaymentMethod } from "@/types/payment";


export default function IntegrationTab() {
  const { data, isLoading } = useGetAllPaymentMethodsQuery()
  const [toggleMethod, { isLoading:loadingToggle }] = useTogglePaymentMutation()
  const paymentsMethods = data?.data || [];

  const [confirmDisable, setConfirmDisable] = useState<PaymentMethod | null>(null);


  const handleToggle = (method: PaymentMethod, index: number) => {
    if (method.enabled) {
      setConfirmDisable(method);
    } else {
    toggleMethod(method.id);
    }
  };

  
  const confirmDisableIntegration = () => {
    if (!confirmDisable) return;
    toggleMethod(confirmDisable.id);
    setConfirmDisable(null);
  };
  return (
    <div className="relative flex">
      {/* ================= LEFT CONTENT ================= */}
      <div className={`transition-all duration-300 ${/* selectedIntegration ? "w-2/3 pr-6" :*/ "w-full"}`}>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Integration & API Settings</h2>
            <p className="text-muted-foreground">Seamlessly connect GoKart with your essential third-party services.</p>
          </div>

          <div
            className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${
              /* selectedIntegration ? "lg:grid-cols-2" :*/ "lg:grid-cols-3"
              } transition-all duration-300`}
          >
            {paymentsMethods.map((method, index) => (
              <div
                key={index}
                className="s rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={method.logo} alt={method.name} className="h-10 w-10 rounded-md object-cover" />
                    <h3 className="font-medium">{method.name}</h3>
                  </div>

                  <Button
                    size="icon"
                    onClick={() => handleToggle(method, index)}
                    className={`relative h-6 w-11 rounded-full p-0 transition-colors ${method.enabled ? "default" : "bg-gray-300 dark:bg-zinc-700"
                      }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${method.enabled ? "translate-x-5" : ""
                        }`}
                    />
                  </Button>
                </div>

                <p className="text-muted-foreground mt-4 text-sm">{method.description}</p>

                {/* <div className="my-4 border-t" />*/}

                {/* <div className="flex justify-end">*/}
                {/*  <Button onClick={() => setSelectedmethod(method)}>View method</Button>*/}
                {/* </div>*/}
              </div>
            ))}
          </div>
        </div>
      </div>

     
      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmDisable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[500px] rounded-xl bg-white p-6 pt-12 shadow-xl dark:bg-zinc-900">
            <Button variant="ghost" onClick={() => setConfirmDisable(null)} className="absolute top-3 right-3">
              <X className="h-6 w-6" />
            </Button>
            <h3 className="mb-4 text-lg font-semibold">Are you sure you want to disable this integration?</h3>

            <p className="text-muted-foreground mb-6 text-sm">
              Disabling this integration will immediately stop all data synchronization and connected features linked to
              this API. Any automated tasks, reports, or real-time updates depending on this connection will no longer
              function until it’s re-enabled.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="destructive" onClick={confirmDisableIntegration}>
                Yes, Disable
              </Button>
              <Button onClick={() => setConfirmDisable(null)}>No, Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

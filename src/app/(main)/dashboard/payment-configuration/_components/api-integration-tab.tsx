"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Copy, X, Check } from "lucide-react";

type Integration = {
  name: string;
  description: string;
  enabled: boolean;
  image: string;
  lastSynced?: number;
  docs: string;

  credentials: {
    publicKey: string;
    secretKey: string;
    webhookUrl: string;
    environment: string;
  };

  config: {
    currency: string;
    fee: string;
    testMode: string;
    connectionMethod: string;
  };
};

export default function IntegrationTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      name: "Paystack",
      description: "Seamlessly process online payments and refunds via Paystack&apos;ssecure payment gateway.",
      enabled: false,
      image: "/images/paystack.png",
      lastSynced: undefined,
      docs: "https://paystack.com/docs",

      credentials: {
        publicKey: "pk_live_paystack_123",
        secretKey: "sk_live_paystack_456",
        webhookUrl: "https://gokart.com/webhooks/paystack",
        environment: "production",
      },

      config: {
        currency: "NGN",
        fee: "1.5%",
        testMode: "Disabled",
        connectionMethod: "API Key + Webhook",
      },
    },
    {
      name: "Moniepoint",
      description: "Add Moniepoint as an additional payment provider for in-store and online transactions.",
      enabled: false,
      image: "/images/moniepoint.png",
      lastSynced: undefined,
      docs: "https://docs.pos.moniepoint.com/",

      credentials: {
        publicKey: "MPK_PUBLIC_1234567890abcdef",
        secretKey: "MPK_SECRET_abcdef1234567890abcdef123456",
        webhookUrl: "https://gokart.com/webhooks/moniepoint",
        environment: "sandbox", // production
      },

      config: {
        currency: "NGN",
        fee: "1.5%", // Actual fee depends on your contract
        testMode: "Disabled", // Use "Enabled" if using sandbox
        connectionMethod: "API Key + Webhook",
      },
    },
    {
      name: "Flutterwave",
      description:
        "Easily accept payments from customers in Nigeria and beyond, making your e-commerce store seamless and secure with Flutterwave.",
      enabled: false,
      image: "/images/flutterwave.png",
      lastSynced: undefined,
      docs: "https://developer.flutterwave.com/docs",

      credentials: {
        publicKey: "FLWPUBK_TEST-xxxxxxxxxxxxxxxx-X",
        secretKey: "FLWSECK_TEST-xxxxxxxxxxxxxxxx-X",
        webhookUrl: "https://gokart.com/webhooks/flutterwave",
        environment: "sandbox", // production
      },

      config: {
        currency: "NGN",
        fee: "1.4% (local) / 3.8% (international approx.)",
        testMode: "Enabled", // Disabled in production
        connectionMethod: "Public Key + Secret Key + Webhook",
      },
    },
    {
      name: "Opay",
      description: "Use Opay as one of your payment provider for the in-store and online transactions",
      enabled: false,
      image: "/images/opay.png",
      lastSynced: undefined,
      docs: "https://documentation.opayweb.com/doc/offline/overview.html",

      credentials: {
        publicKey: "OPAY_PUBLIC_xxxxxxxxxxxxx",
        secretKey: "OPAY_SECRET_xxxxxxxxxxxxx",
        webhookUrl: "https://gokart.com/webhooks/opay",
        environment: "sandbox", // production
      },

      config: {
        currency: "NGN",
        fee: "1.5% (depends on agreement)",
        testMode: "Enabled",
        connectionMethod: "Merchant ID + API Key + Webhook",
      },
    },
    {
      name: "Palmpay",
      description: "Enable Palmpay to process seamless digital payments for your customers across Nigeria.",
      enabled: false,
      image: "/images/palmpay.png",
      lastSynced: undefined,
      docs: "https://docs.palmpay.com/",

      credentials: {
        publicKey: "PALMPAY_PUBLIC_xxxxxxxxxxxxx",
        secretKey: "PALMPAY_SECRET_xxxxxxxxxxxxx",
        webhookUrl: "https://gokart.com/webhooks/palmpay",
        environment: "sandbox", // production
      },

      config: {
        currency: "NGN",
        fee: "Negotiated rate (varies per merchant)",
        testMode: "Enabled",
        connectionMethod: "App ID + Private Key + Webhook",
      },
    },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const [confirmDisable, setConfirmDisable] = useState<Integration | null>(null);

  const [showDocs, setShowDocs] = useState(false);

  const [showSecret, setShowSecret] = useState(false);

  const handleToggle = (integration: Integration, index: number) => {
    if (integration.enabled) {
      setConfirmDisable(integration);
    } else {
      const updated = [...integrations];
      updated[index].enabled = true;
      updated[index].lastSynced = Date.now();
      setIntegrations(updated);
    }
  };

  const timeAgo = (timestamp?: number) => {
    if (!timestamp) return "Never";

    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff} sec${diff > 1 ? "s" : ""} ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? "s" : ""} ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
  };

  const handleCopy = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value);
    console.log("Copied:", value);
  };

  const handleViewKey = () => {
    setShowSecret((prev) => !prev);
  };

  const confirmDisableIntegration = () => {
    if (!confirmDisable) return;

    const updated = integrations.map((item) =>
      item.name === confirmDisable.name ? { ...item, enabled: false } : item,
    );

    setIntegrations(updated);
    setConfirmDisable(null);
  };
  return (
    <div className="relative flex">
      {/* ================= LEFT CONTENT ================= */}
      <div className={`transition-all duration-300 ${selectedIntegration ? "w-2/3 pr-6" : "w-full"}`}>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Integration & API Settings</h2>
            <p className="text-muted-foreground">Seamlessly connect GoKart with your essential third-party services.</p>
          </div>

          <div
            className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${
              selectedIntegration ? "lg:grid-cols-2" : "lg:grid-cols-3"
            } transition-all duration-300`}
          >
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="s rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={integration.image} alt={integration.name} className="h-10 w-10 rounded-md object-cover" />
                    <h3 className="font-medium">{integration.name}</h3>
                  </div>

                  <Button
                    size="icon"
                    onClick={() => handleToggle(integration, index)}
                    className={`relative h-6 w-11 rounded-full p-0 transition-colors ${
                      integration.enabled ? "default" : "bg-gray-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        integration.enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </Button>
                </div>

                <p className="text-muted-foreground mt-4 text-sm">{integration.description}</p>

                <div className="my-4 border-t" />

                <div className="flex justify-end">
                  <Button onClick={() => setSelectedIntegration(integration)}>View Integration</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedIntegration && (
        <div className="w-1/3 border-l bg-white p-6 shadow-xl dark:bg-zinc-950">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="mb-2 text-lg font-semibold">Integration Overview</h3>
            <Button variant="ghost" onClick={() => setSelectedIntegration(null)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <img src={selectedIntegration.image} className="h-12 w-12 rounded-md" />
            <div>
              <p className="font-medium">{selectedIntegration.name}</p>
              <p className="text-muted-foreground text-sm">{selectedIntegration.description}</p>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-center gap-4 text-sm">
            {/* Status */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
                selectedIntegration.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedIntegration.enabled ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                }`}
              >
                <Check className="h-3 w-3" />
              </span>
              {selectedIntegration.enabled ? "Active" : "Inactive"}
            </span>

            {/* Last Synced */}
            <span className="text-muted-foreground text-sm">
              Last Synced: {timeAgo(selectedIntegration.lastSynced)}
            </span>
          </div>

          {/* API Credentials */}
          <div className="mb-6 rounded-md">
            <h4 className="mb-3 bg-gray-100 p-4 font-semibold dark:bg-zinc-800">API Credentials</h4>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Public Key</p>
                <div className="flex justify-between font-mono text-xs break-all">
                  <span>{selectedIntegration?.credentials.publicKey}</span>
                  <Button
                    size="sm"
                    className="bg-purple-800 text-purple-600"
                    onClick={() => handleCopy(selectedIntegration?.credentials.publicKey || "")}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Secret Key</p>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs break-all">
                      {showSecret ? selectedIntegration?.credentials.secretKey : "••••••••••••••••"}
                    </span>

                    <div className="flex justify-end gap-3">
                      <Button size="sm" className="bg-purple-800 text-purple-600" onClick={handleViewKey}>
                        <Eye className="h-4 w-4" />
                        {showSecret ? "Hide" : "View"}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-purple-800 text-purple-600"
                        onClick={() => handleCopy(selectedIntegration?.credentials.secretKey || "")}
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Webhook URL</p>
                  <div className="flex justify-between font-mono text-xs break-all">
                    <span>{selectedIntegration?.credentials.webhookUrl}</span>
                    <Button
                      size="sm"
                      className="bg-purple-800 text-purple-600"
                      onClick={() => handleCopy(selectedIntegration?.credentials.webhookUrl || "")}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Environment</p>
                  <div className="flex justify-between font-mono text-xs break-all">
                    <span>{selectedIntegration?.credentials.environment}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-md">
            <h4 className="mb-3 bg-gray-100 p-4 font-semibold dark:bg-zinc-800">API Configurations</h4>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Default Currency</p>
                <div className="flex justify-between font-mono text-xs break-all">
                  <span>{selectedIntegration?.config.currency}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Transaction Fee (%)</p>
                  <div className="flex justify-between font-mono text-xs break-all">
                    <span>{selectedIntegration?.config.fee}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Test Mode</p>
                  <div className="flex justify-between font-mono text-xs break-all">
                    <span>{selectedIntegration?.config.testMode}</span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Connection Method</p>
                  <div className="flex justify-between font-mono text-xs break-all">
                    <span>{selectedIntegration?.config.connectionMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between">
            <Button className="bg-gray-500 dark:bg-zinc-700" onClick={() => setShowDocs(true)}>
              View Documentation
            </Button>
            {showDocs && selectedIntegration && (
              <div className="fixed top-0 right-0 h-full w-1/3 border-l bg-white p-6 shadow-2xl dark:bg-zinc-950">
                <div className="mb-4 flex justify-between">
                  <h3 className="mb-2 text-lg font-semibold">API Documentation</h3>
                  <Button variant="ghost" onClick={() => setShowDocs(false)}>
                    <X />
                  </Button>
                </div>

                <iframe src={selectedIntegration.docs} className="h-full w-full rounded-md border" />
              </div>
            )}

            <Button variant="destructive" onClick={() => setConfirmDisable(selectedIntegration)}>
              Disconnect Integration
            </Button>
          </div>
        </div>
      )}

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

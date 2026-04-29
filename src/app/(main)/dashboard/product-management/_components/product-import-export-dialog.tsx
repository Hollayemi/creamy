"use client";

import { useState, useRef } from "react";
import { Upload, Download, FileText, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useImportProductsFromCsvMutation } from "@/stores/services/productApi";

// ─── Helpers ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://gokart-foht.onrender.com/api/v1";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function downloadFile(url: string, filename: string) {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || "Download failed");
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ImportResult {
  imported: number;
  failed: number;
  errors?: string[];
}

interface ProductImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current filter params forwarded to the export endpoint */
  exportParams?: Record<string, any>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductImportExportDialog({
  open,
  onOpenChange,
  exportParams,
}: ProductImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const [templateLoading, setTemplateLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importProducts, { isLoading: importing }] = useImportProductsFromCsvMutation();

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setActiveTab("import");
    onOpenChange(false);
  };

  // ── File selection ────────────────────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Only CSV files are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10 MB");
      return;
    }
    setSelectedFile(file);
    setImportResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // ── Import ────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await importProducts(formData).unwrap();
      const result = res.data ?? { imported: 0, failed: 0 };
      setImportResult(result);
      if (result.imported > 0) {
        toast.success(`${result.imported} product(s) imported successfully`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} row(s) failed to import`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Import failed");
    }
  };

  // ── Download template ─────────────────────────────────────────────────────
  const handleDownloadTemplate = async () => {
    setTemplateLoading(true);
    try {
      await downloadFile("/product/import/template", "products_template.csv");
      toast.success("Template downloaded");
    } catch (err: any) {
      toast.error(err?.message || "Failed to download template");
    } finally {
      setTemplateLoading(false);
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const params = exportParams
        ? "?" + new URLSearchParams(Object.fromEntries(Object.entries(exportParams).filter(([, v]) => v != null))).toString()
        : "";
      await downloadFile(`/product/export${params}`, `products_export_${Date.now()}.csv`);
      toast.success("Products exported successfully");
    } catch (err: any) {
      toast.error(err?.message || "Export failed");
    } finally {
      setExportLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import / Export Products</DialogTitle>
          <DialogDescription>Bulk manage your product catalogue with CSV files.</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["import", "export"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-all",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Import Tab ──────────────────────────────────────────────────── */}
        {activeTab === "import" && (
          <div className="space-y-4">
            {/* Download template banner */}
            <div className="flex items-center justify-between rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Download the template before uploading</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400"
                onClick={handleDownloadTemplate}
                disabled={templateLoading}
              >
                {templateLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                Template
              </Button>
            </div>

            {/* Drop zone */}
            {!importResult && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Drop your CSV file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse — max 10 MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                    e.target.value = "";
                  }}
                />
              </div>
            )}

            {/* Import result */}
            {importResult && (
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-sm">Import complete</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-green-50 p-3 dark:bg-green-950/30">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">{importResult.imported}</p>
                    <p className="text-xs text-green-600 dark:text-green-500">Imported</p>
                  </div>
                  <div className="rounded-md bg-red-50 p-3 dark:bg-red-950/30">
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{importResult.failed}</p>
                    <p className="text-xs text-red-600 dark:text-red-500">Failed</p>
                  </div>
                </div>
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="max-h-32 overflow-y-auto rounded border border-red-200 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-950/20">
                    {importResult.errors.map((err, i) => (
                      <div key={i} className="flex items-start gap-1.5 py-0.5">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                        <p className="text-xs text-red-700 dark:text-red-400">{err}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setImportResult(null);
                    setSelectedFile(null);
                  }}
                >
                  Import another file
                </Button>
              </div>
            )}

            {/* Actions */}
            {!importResult && (
              <div className="flex gap-2">
                {selectedFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                )}
                <Button
                  className="flex-1 gap-2"
                  disabled={!selectedFile || importing}
                  onClick={handleImport}
                >
                  {importing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {importing ? "Importing…" : "Import Products"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── Export Tab ──────────────────────────────────────────────────── */}
        {activeTab === "export" && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-5 text-center space-y-3">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-primary/10">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Export Product Catalogue</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Downloads all current products{exportParams?.search ? ` matching "${exportParams.search}"` : ""} as a
                  CSV file, including all active filters.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-dashed px-4 py-3 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">What's included</p>
              {["Product name, ID & SKU", "Category, price & stock", "Status & variants", "Regional distribution"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ),
              )}
            </div>

            <Button className="w-full gap-2" onClick={handleExport} disabled={exportLoading}>
              {exportLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exportLoading ? "Exporting…" : "Download CSV"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

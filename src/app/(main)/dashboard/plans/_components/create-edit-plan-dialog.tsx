"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/stores/services/subscriptionApi";

import {
    Plan,
    CreatePlanPayload,
    UpdatePlanPayload,
} from "@/types/payment";


const planSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive").or(z.string().transform(Number)),
  durationDays: z.number().min(1, "Duration must be at least 1 day").or(z.string().transform(Number)),
  discountPercentage: z
    .number()
    .min(0, "Discount must be between 0 and 100")
    .max(100, "Discount must be between 0 and 100")
    .or(z.string().transform(Number)),
  maxDiscountAmountPerOrder: z
    .number()
    .min(0, "Max discount must be positive")
    .optional()
    .or(z.string().transform(Number).optional()),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  badgeColor: z.string().optional(),
  isActive: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface CreateEditPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  plan?: Plan | null;
  onSuccess: () => void;
}

const badgeColors = [
  { value: "gold", label: "Gold", class: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
  { value: "silver", label: "Silver", class: "bg-gradient-to-r from-gray-300 to-gray-500" },
  { value: "platinum", label: "Platinum", class: "bg-gradient-to-r from-gray-400 to-gray-700" },
  { value: "bronze", label: "Bronze", class: "bg-gradient-to-r from-amber-600 to-amber-800" },
  { value: "blue", label: "Blue", class: "bg-gradient-to-r from-blue-500 to-blue-700" },
  { value: "purple", label: "Purple", class: "bg-gradient-to-r from-purple-500 to-purple-700" },
];

export default function CreateEditPlanDialog({
  open,
  onOpenChange,
  mode,
  plan,
  onSuccess,
}: CreateEditPlanDialogProps) {
  const [featureInput, setFeatureInput] = useState("");
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      durationDays: 30,
      discountPercentage: 0,
      maxDiscountAmountPerOrder: undefined,
      features: [],
      badgeColor: "blue",
      isActive: true,
    },
  });

  useEffect(() => {
    if (mode === "edit" && plan) {
      form.reset({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        durationDays: plan.durationDays,
        discountPercentage: plan.discountPercentage,
        maxDiscountAmountPerOrder: plan.maxDiscountAmountPerOrder,
        features: plan.features,
        badgeColor: plan.badgeColor || "blue",
        isActive: plan.isActive,
      });
    } else if (mode === "create" && open) {
      form.reset({
        name: "",
        description: "",
        price: 0,
        durationDays: 30,
        discountPercentage: 0,
        maxDiscountAmountPerOrder: undefined,
        features: [],
        badgeColor: "blue",
        isActive: true,
      });
    }
  }, [mode, plan, open, form]);

  const onSubmit = async (data: PlanFormValues) => {
    try {
      if (mode === "create") {
        const payload: CreatePlanPayload = {
          name: data.name,
          description: data.description,
          price: data.price,
          durationDays: data.durationDays,
          discountPercentage: data.discountPercentage,
          maxDiscountAmountPerOrder: data.maxDiscountAmountPerOrder,
          features: data.features,
          badgeColor: data.badgeColor,
        };
        await createPlan(payload).unwrap();
        toast.success("Plan created successfully");
      } else if (mode === "edit" && plan) {
        const payload: UpdatePlanPayload = {
          name: data.name,
          description: data.description,
          price: data.price,
          durationDays: data.durationDays,
          discountPercentage: data.discountPercentage,
          maxDiscountAmountPerOrder: data.maxDiscountAmountPerOrder,
          features: data.features,
          badgeColor: data.badgeColor,
          isActive: data.isActive,
        };
        await updatePlan({ id: plan._id, data: payload }).unwrap();
        toast.success("Plan updated successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(mode === "create" ? "Failed to create plan" : "Failed to update plan");
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = form.getValues("features");
      if (!currentFeatures.includes(featureInput.trim())) {
        form.setValue("features", [...currentFeatures, featureInput.trim()]);
        setFeatureInput("");
      }
    }
  };

  const removeFeature = (featureToRemove: string) => {
    const currentFeatures = form.getValues("features");
    form.setValue(
      "features",
      currentFeatures.filter((f) => f !== featureToRemove)
    );
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Plan" : "Edit Plan"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new subscription plan for your customers"
              : "Modify the plan details below"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Premium Monthly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the plan benefits and features..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxDiscountAmountPerOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Discount Per Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Optional"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : parseFloat(val));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Optional cap for discount amount</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="badgeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a badge color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {badgeColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full ${color.class}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a feature (e.g., 24/7 Support)"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="ml-1 rounded-full hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {field.value.length === 0 && (
                        <p className="text-muted-foreground text-sm">No features added yet</p>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "edit" && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Inactive plans won't be visible to customers
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Plan"
                  : "Update Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
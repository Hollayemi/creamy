"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash, Calendar as CalendarIcon, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useCreateCouponMutation } from "@/stores/services/promotionApi";
import { promoType } from "@/types/promotion";
import { MultiSelect } from "@/components/ui/select-multiple";
import { Badge } from "@/components/ui/badge";
import { useGetProductsQuery } from "@/stores/services/productApi";
import { Product, ProductInventory } from "@/types/product";
import { useGetCategoriesQuery, useGetRegionsQuery } from "@/stores/services/config";
import { CategoriesRegionResponse } from "@/types/config";

interface IDSelect {
    value: string;
    label: string
}

export default function AddPromotionPage() {
    const router = useRouter();
    const { data: products, isLoading } = useGetProductsQuery({ search: "" })
    const { data: defaultCategories, isLoading: categoryLoading } = useGetCategoriesQuery({})
    const { data: defaultRegions, isLoading: regionLoading } = useGetRegionsQuery({})
    const [promotionName, setPromotionName] = useState("");
    const [promoType, setPromoType] = useState<promoType>("Percentage");
    const [couponCode, setCouponCode] = useState("");
    const [discountValue, setDiscountValue] = useState("");
    const [usageLimit, setUsageLimit] = useState("");
    const [perUserLimit, setPerUserLimit] = useState("");
    const [description, setDescription] = useState("");
    const [minimumOrderValue, setMinimumOrderValue] = useState("");
    const [minimumOrderAmount, setMinimumOrderAmount] = useState("0");
    const [applicableCategories, setApplicableCategories] = useState<IDSelect[]>([]);
    const [applicableProducts, setApplicableProducts] = useState<IDSelect[]>([]);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState("10:00 AM");
    const [regions, setRegions] = useState<IDSelect[]>([]);


    console.log({ regions });

    const availableCategories: CategoriesRegionResponse[] = Array.isArray(defaultCategories?.data) ? defaultCategories.data : []
    const availableRegions: CategoriesRegionResponse[] = Array.isArray(defaultRegions?.data) ? defaultRegions.data : []
    const availableProducts = products?.data?.products || []

    console.log({ availableCategories, availableRegions })


    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();


    // Time slots for scheduling
    const timeSlots = [
        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    ];

    const generateCouponCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCouponCode(code);
    };

    const handleSaveDraft = () => {
        console.log("Saving as draft...");
    };

    const handlePublish = () => {
        console.log("Publishing promotion...");
        createCoupon({
            promotionName,
            promoType,
            couponCode,
            discountValue: parseInt(discountValue),
            usageLimit: parseInt(usageLimit),
            perUserLimit: parseInt(perUserLimit),
            description,
            minimumOrderValue: parseInt(minimumOrderValue),
            applicableCategories: applicableCategories.map((e) => e.value),
            applicableProducts: applicableProducts.map((e) => e.value),
            startDateTime: startDate,
            endDateTime: endDate,
        }).unwrap();

    };

    const handleSchedulePublish = () => {
        if (selectedDate) {
            setShowScheduleDialog(false);
            console.log("Scheduled for:", format(selectedDate, "PPP"), "at", selectedTime);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-2">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Inventory
                </button>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveDraft}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-muted "
                        onClick={() => setShowScheduleDialog(true)}
                    >
                        <CalendarIcon className="h-4 w-4" />
                        Schedule Publish
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary"
                        onClick={handlePublish}
                    >
                        Publish
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Form */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-6">Add New Discount</h2>

                        {/* Product Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Product Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="promotionName">Promotion Name</Label>
                                    <Input
                                        id="promotionName"
                                        placeholder="Type in the promotion name"
                                        value={promotionName}
                                        onChange={(e) => setPromotionName(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="promoType">Promo Type</Label>
                                    <Select value={promoType} onValueChange={(value: string) => setPromoType(value as promoType)}>
                                        <SelectTrigger id="promoType" className="bg-gray-50 w-full dark:bg-gray-900">
                                            <SelectValue placeholder="Select the promotion type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Percentage">Percentage</SelectItem>
                                            <SelectItem value="Fixed">Flat Amount</SelectItem>
                                            <SelectItem value="Free-Shipping">Free Shipping</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="couponCode">Coupon Code</Label>
                                    <div className="relative">
                                        <Input
                                            id="couponCode"
                                            placeholder="Type in the coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="bg-gray-50 dark:bg-gray-900 pr-10"
                                        />
                                        <button
                                            onClick={generateCouponCode}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discountValue">Discount Value</Label>
                                    <Input
                                        id="discountValue"
                                        placeholder="Type in the discount value"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="usageLimit">Usage Limit</Label>
                                    <Input
                                        id="usageLimit"
                                        placeholder="Type in the usage limit"
                                        value={usageLimit}
                                        onChange={(e) => setUsageLimit(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="perUserLimit">Per User Limit</Label>
                                    <Input
                                        id="perUserLimit"
                                        placeholder="Type in the per user limit"
                                        value={perUserLimit}
                                        onChange={(e) => setPerUserLimit(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={6}
                                    placeholder="Type in the description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-900 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minimumOrderValue">Minimum Order Value</Label>
                                    <Input
                                        id="minimumOrderValue"
                                        placeholder="Type in the minimum order value"
                                        value={minimumOrderValue}
                                        onChange={(e) => setMinimumOrderValue(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="applicableCategories">Applicable Categories</Label>
                                    <MultiSelect
                                        options={availableCategories.map((each: CategoriesRegionResponse) => ({ value: each.id, label: each.displayName }))}
                                        value={applicableCategories.map(n => n.label)}
                                        customOnchange={(value: string) => {
                                            console.log(value)
                                            setApplicableCategories((prev: any) => {
                                                const exists = prev.find((r: IDSelect) => r.value === value);
                                                if (exists) {
                                                    return prev.filter((r: IDSelect) => r.value !== value);
                                                }
                                                const label = availableCategories.find(e => e.id === value)
                                                return [...prev, { value, label: label?.displayName, }];
                                            })
                                        }
                                        }
                                        fixedPlaceholder={`Select categories (${applicableCategories.length}) selected`}
                                        triggerClassName="h-11 bg-muted"
                                        contentClassName="w-full"
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                        {applicableCategories.map((tag: any) => (
                                            <Badge key={tag.value} variant="outline" className="gap-1">
                                                {tag.label}
                                                <button
                                                    onClick={() => setApplicableCategories((prev) => prev.filter((r) => r.value !== tag.value))}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    {/* <Select value={applicableCategories} onValueChange={(value: string) => setApplicableCategories(value as )}>
                                        <SelectTrigger id="applicableCategories" className="bg-gray-50 dark:bg-gray-900">
                                            <SelectValue placeholder="Select the categories applicable" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="packaged-foods">Packaged Foods</SelectItem>
                                            <SelectItem value="beverages">Beverages</SelectItem>
                                            <SelectItem value="household">Household</SelectItem>
                                        </SelectContent>
                                    </Select> */}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date & Time</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal bg-gray-50 dark:bg-gray-900",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : "Select the start date & time"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label>End Date & Time</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal bg-gray-50 dark:bg-gray-900",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : "Select the end date & time"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Terms & Conditions */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Discount Terms & Condition</h2>

                        <div className="space-y-4">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                Applies to customers in
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="Regions">Inventory Region</Label>
                                <MultiSelect
                                    options={availableRegions.map((each: CategoriesRegionResponse) => ({ value: each.id, label: each.displayName }))}
                                    value={regions.map(n => n.label)}
                                    customOnchange={(value: string) => {
                                        console.log(value)
                                        setRegions((prev: any) => {
                                            const exists = prev.find((r: IDSelect) => r.value === value);
                                            if (exists) {
                                                return prev.filter((r: IDSelect) => r.value !== value);
                                            }
                                            const label = availableRegions.find(e => e.id === value)
                                            return [...prev, { value, label: label?.displayName, }];
                                        })
                                    }
                                    }
                                    fixedPlaceholder={`Select Regions (${regions.length}) selected`}
                                    triggerClassName="h-11 bg-muted"
                                    contentClassName="w-full"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {regions.map((tag: any) => (
                                    <Badge key={tag.value} variant="outline" className="gap-1">
                                        {tag.label}
                                        <button
                                            onClick={() => setRegions((prev) => prev.filter((r) => r.value !== tag.value))}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                who spend at least
                            </p>
                            <div className="relative">
                                <h5 className="absolute left-3 top-1.5">₦</h5>
                                <Input
                                    id="minimumOrderAmount"
                                    placeholder="Minimum Order Amount"
                                    value={parseInt(minimumOrderAmount || "0").toLocaleString()}
                                    onChange={(e) => setMinimumOrderAmount(e.target.value.replaceAll(",", ""))}
                                    className="bg-gray-50 dark:bg-gray-900 pl-8"
                                />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                on an order.
                            </p>

                            <div className="pt-6 space-y-2">
                                <Label htmlFor="applicableProducts">Applicable Products</Label>

                                <MultiSelect
                                    options={availableProducts.map((each: any) => ({ value: each._id, label: each.productName }))}
                                    value={regions.map(n => n.label)}
                                    customOnchange={(value: string) => {
                                        console.log(value)
                                        setApplicableProducts((prev: any) => {
                                            const exists = prev.find((r: IDSelect) => r.value === value);
                                            if (exists) {
                                                return prev.filter((r: IDSelect) => r.value !== value);
                                            }
                                            const label = availableProducts.find(e => e._id === value)
                                            return [...prev, { value, label: label?.productName, }];
                                        })
                                    }
                                    }
                                    fixedPlaceholder={`Select Regions (${regions.length}) selected`}
                                    triggerClassName="h-11 bg-muted"
                                    contentClassName="w-full"
                                />

                                <div className="flex gap-2 flex-wrap">
                                    {applicableProducts.map((tag: any) => (
                                        <Badge key={tag.value} variant="outline" className="gap-1">
                                            {tag.label}
                                            <button
                                                onClick={() => setApplicableProducts((prev: IDSelect[]) => prev.filter((r) => r.value !== tag.value))}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Publish Dialog */}
            {showScheduleDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Back to Staff Management</h3>
                            <button
                                onClick={() => setShowScheduleDialog(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 flex flex-1">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border mx-auto"
                            />

                            <div className="h-80  overflow-y-auto border rounded-md">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={cn(
                                            "w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700",
                                            selectedTime === time && "bg-purple-50 dark:bg-purple-900/20 text-primary"
                                        )}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t p-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowScheduleDialog(false)}
                            >
                                Cancel
                            </Button>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"} {selectedTime}
                                </span>
                                <Button
                                    onClick={handleSchedulePublish}
                                    disabled={!selectedDate}
                                >
                                    Schedule
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
"use client"

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, MoreHorizontal, TrendingUp, ChevronRight, Tag, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useGetProductMovementHistoryQuery, useGetProductPreviewQuery } from '@/stores/services/productApi';
import { toast } from 'sonner';

const ProductPreviewPage = ({ searchParams }: any) => {
    const mysearchParams = use(searchParams) as any
    const router = useRouter();
    const productId = mysearchParams?.id //"6924f6b281b1e6feb92992e0"

    console.log({ productId })

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState('7');

    // Fetch product preview data
    const { data, isLoading, isError, error } = useGetProductPreviewQuery(productId, {
        skip: !productId,
    });

    const { data: movenetData, isLoading: movementLoading, } = useGetProductMovementHistoryQuery(productId, { skip: !productId })

    const history = movenetData?.data || null

    console.log({ movenetData })
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">Loading product details...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (isError || !data?.data) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-destructive">Failed to load product</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {(error as any)?.data?.message || 'An error occurred while loading the product'}
                    </p>
                    <Button onClick={() => router.back()} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const { product, analytics, pricing, inventory, overview } = data.data;

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    // Get status color helper
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'stable':
            case 'balanced':
                return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
            case 'low stock':
                return 'text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400';
            case 'out of stock':
                return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
            default:
                return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    // Format month for chart
    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[parseInt(month) - 1];
    };

    // Handle share
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.productName,
                text: `Check out ${product.productName}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    // Handle duplicate
    const handleDuplicate = () => {
        router.push(`/dashboard/product-management/duplicate?id=${productId}`);
    };

    return (
        <div className="min-h-screen bg-background p-2 py-0">
            {/* Header */}
            <div className="mb-6 flex flex-row md:items-center justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                            <h2 className="text-2xl font-semibold text-nowrap text-ellipsis w-7/12 md:w-fit">
                                {product.productName}
                            </h2>
                            <Badge className={`${product.status === 'active'
                                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400'
                                }`}>
                                {product.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>SKU: {product.sku}</span>
                            <span>•</span>
                            <span>Created: {formatDate(product.createdAt)}</span>
                            <span>•</span>
                            <span>Last Updated: {formatDate(product.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="md:mr-2 h-4 w-4" />
                            <span className='hidden md:block'>Share Products</span>
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleDuplicate}>
                                <Copy className="md:mr-2 h-4 w-4" />
                                <span className='hidden md:block'>Duplicate</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/product-management/${productId}/edit`)}>
                                        Edit Product
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>View History</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className='mt-2 flex items-center gap-1 md:justify-end'>
                        <h4 className='mr-3'>Product <b>{productId}</b></h4>
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 relative">
                <div className="space-y-6 lg:col-span-2">
                    <div className='shadow-none border-0'>
                        <div>
                            <div className="flex flex-col gap-6">
                                {/* Images */}
                                <div className="flex gap-4">
                                    <div className="flex gap-2">
                                        {product.images.slice(0, 5).map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-32 w-32 overflow-hidden rounded-lg border-2 transition-all ${currentImageIndex === idx
                                                    ? 'border-primary'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={img} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex-1">
                                    <h3 className="mb-3 text-lg font-semibold">Description</h3>
                                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className='my-10'>
                        <div className='flex items-center justify-between gap-6 mb-4'>
                            <div>
                                <Label>Sales Price</Label>
                                <Input
                                    className="h-10 w-52 bg-muted mt-2"
                                    value={`₦${pricing.salesPrice.toLocaleString()}`}
                                    disabled
                                />
                            </div>
                            <div>
                                <Label>Cost Per Item</Label>
                                <Input
                                    className="h-10 w-52 bg-muted mt-2"
                                    value={`₦${pricing.costPerItem.toLocaleString()}`}
                                    disabled
                                />
                            </div>
                            <div>
                                <Label>Profit</Label>
                                <Input
                                    className="h-10 w-52 bg-muted mt-2"
                                    value={`₦${pricing.profit.toLocaleString()}`}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-6 border rounded-xl p-4 py-6'>
                            <div className='w-52'>
                                <Label>Gross Margin</Label>
                                <h5 className="text-lg font-semibold">{pricing.grossMargin.toFixed(2)}%</h5>
                            </div>
                            <div className='w-52'>
                                <Label>Total Stock</Label>
                                <h5 className="text-lg font-semibold">{product.totalStock}</h5>
                            </div>
                            <div className='w-52'>
                                <Label>Available Stock</Label>
                                <h5 className="text-lg font-semibold">{product.stockQuantity}</h5>
                            </div>
                        </div>
                    </div>

                    {/* Inventory by Region */}
                    <Card className='shadow-none border-0 p-0! m-0! mb-16!'>
                        <CardHeader className='m-0! p-0'>
                            <CardTitle className='text-bold'>Inventory by Region</CardTitle>
                        </CardHeader>
                        <CardContent className='m-0! border rounded-xl p-2'>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Region</TableHead>
                                            <TableHead>Current Stock</TableHead>
                                            <TableHead>Last Restocked</TableHead>
                                            <TableHead>Manager</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inventory.byRegion.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium">{item.region}</TableCell>
                                                <TableCell>{item.currentStock}</TableCell>
                                                <TableCell>{formatDate(item.lastRestocked)}</TableCell>
                                                <TableCell>{item.manager}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getStatusColor(item.status)}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock History */}
                    <Card className="shadow-none border-0 p-0! m-0! mb-10!">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Stock & Movement History</CardTitle>
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">7 Days</SelectItem>
                                    <SelectItem value="30">30 Days</SelectItem>
                                    <SelectItem value="90">90 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                                    <div>Date</div>
                                    <div>Action</div>
                                    <div>Quantity</div>
                                    <div>Order Number</div>
                                </div>
                                {history?.history?.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-4 gap-4 border-t pt-4 text-sm">
                                        <div>{item.date}</div>
                                        <div>{item.action}</div>
                                        <div className={item.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                                            {item.quantity > 0 ? '+' : ''}{item.quantity}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{item.orderNumber}</div>
                                    </div>
                                ))}
                                <Button variant="link" className="w-full">
                                    Show More →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Stats and Info */}
                <div className="space-y-6 sticky! top-20!">
                    {/* Total Sales */}
                    <Card className="shadow-none">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex gap-2 items-center">
                                    <Tag />
                                    Total Sales
                                </CardTitle>
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-3xl font-bold">
                                        ₦ {analytics.totalSales.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>↑ {analytics.percentageChange.toFixed(2)}% vs last month</span>
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        {analytics.totalQuantitySold} units sold • {analytics.totalOrders} orders
                                    </div>
                                </div>

                                {/* Simple Chart */}
                                <div className="flex h-32 items-end gap-2">
                                    {analytics.salesTrend.map((item, idx) => {
                                        const maxRevenue = Math.max(...analytics.salesTrend.map(t => t.revenue));
                                        return (
                                            <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                                                <div
                                                    className="w-full rounded-t-md bg-primary transition-all"
                                                    style={{
                                                        height: `${(item.revenue / maxRevenue) * 100}%`,
                                                    }}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {formatMonth(item.month)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Overview */}
                    <Card className="shadow-none border-t-10 border-t-accent rounded-xl">
                        <CardHeader>
                            <CardTitle>Product Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">SKU</div>
                                <div className="font-medium w-full h-12 mt-1 pl-4 leading-12 rounded-md bg-muted">
                                    {overview.sku}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Category</div>
                                <div className="font-medium w-full h-12 mt-1 pl-4 leading-12 rounded-md bg-muted">
                                    {overview.category}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Stock Level</div>
                                <div className="font-medium w-full h-12 mt-1 pl-4 leading-12 rounded-md bg-muted">
                                    {overview.stockLevel}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Weight / Quantity</div>
                                <div className="font-medium w-full h-12 mt-1 pl-4 leading-12 rounded-md bg-muted">
                                    {overview.weightQuantity}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Availability Status</div>
                                <Badge className={`mt-1 w-20 h-10 ${overview.availabilityStatus === 'active'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400'
                                    }`}>
                                    {overview.availabilityStatus}
                                </Badge>
                            </div>
                            <div>
                                <div className="mb-2 text-sm text-muted-foreground">Tags</div>
                                <div className="flex flex-wrap gap-2">
                                    {overview.tags.map((tag, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="outline"
                                            className="bg-foreground text-background p-3 rounded-full"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProductPreviewPage;
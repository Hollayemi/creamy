"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Bike,
  Car,
  Truck,
  Package,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useGetAllDriversQuery, type Driver } from "@/stores/services/driverApi";
import CreateDriverDialog from "./_components/create-driver-dialog";
import EditDriverDialog from "./_components/edit-driver-dialog";
import DriverActivityLogsDrawer from "./_components/driver-activity-logs-drawer";
import ResendPasswordLinkDialog from "./_components/resend-password-link-dialog";
import SuspendDriverDialog from "./_components/suspend-driver-dialog";
import DisableDriverDialog from "./_components/disable-driver-dialog";
import VerifyDriverDialog from "./_components/verify-driver-dialog";
import DriverOngoingPickups from "./_components/driver-ongoing-pickups";
import DriverPickupHistory from "./_components/driver-pickup-history";

export default function DriverManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActivityLogsOpen, setIsActivityLogsOpen] = useState(false);
  const [isResendPasswordOpen, setIsResendPasswordOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isOngoingPickupsOpen, setIsOngoingPickupsOpen] = useState(false);
const [isPickupHistoryOpen, setIsPickupHistoryOpen] = useState(false);


  const {
    data: driversResponse,
    isLoading,
    refetch,
  } = useGetAllDriversQuery({
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    limit,
  });

  const drivers = driversResponse?.data?.drivers || [];
  const totalPages = driversResponse?.data?.pagination?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      active: { variant: "default", label: "Active" },
      suspended: { variant: "warning", label: "Suspended" },
      disabled: { variant: "destructive", label: "Disabled" },
      pending: { variant: "secondary", label: "Pending" },
      "on-delivery": { variant: "default", label: "On Delivery" },
    };

    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  const getVerificationBadge = (status: string) => {
    const variants: Record<string, { icon: any; color: string; label: string }> = {
      verified: { icon: CheckCircle, color: "text-green-600", label: "Verified" },
      pending: { icon: Clock, color: "text-orange-600", label: "Pending" },
      rejected: { icon: XCircle, color: "text-red-600", label: "Rejected" },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    );
  };

  const getVehicleIcon = (type: string) => {
    const icons: Record<string, any> = {
      motorcycle: Bike,
      bicycle: Bike,
      car: Car,
      van: Car,
      truck: Truck,
    };

    const Icon = icons[type] || Car;
    return <Icon className="h-4 w-4" />;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(drivers.map((d: any) => d._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectDriver = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((did) => did !== id));
    }
  };

  const handleViewActivity = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsActivityLogsOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditDialogOpen(true);
  };

  const handleResendPasswordLink = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsResendPasswordOpen(true);
  };

  const handleSuspend = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsSuspendDialogOpen(true);
  };

  const handleDisable = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDisableDialogOpen(true);
  };

  const handleVerify = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsVerifyDialogOpen(true);
  };

  const handleViewOngoingPickups = (driver: Driver) => {
  setSelectedDriver(driver);
  setIsOngoingPickupsOpen(true);
};

const handleViewPickupHistory = (driver: Driver) => {
  setSelectedDriver(driver);
  setIsPickupHistoryOpen(true);
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Driver Management</h1>
          <p className="text-muted-foreground">
            Manage delivery personnel and their onboarding status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Onboard New Driver
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
            <SelectItem value="on-delivery">On Delivery</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white dark:bg-gray-800 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === drivers.length && drivers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Driver Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground h-32">
                  No drivers found
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(driver._id)}
                      onCheckedChange={(checked) =>
                        handleSelectDriver(driver._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={driver.profilePhoto} alt={driver.fullName} />
                        <AvatarFallback>{getInitials(driver.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{driver.fullName}</p>
                        {!driver.hasSetPassword && (
                          <span className="text-xs text-orange-600">Password not set</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <a href={`mailto:${driver.email}`} className="text-blue-600 hover:underline">
                        {driver.email}
                      </a>
                      <p className="text-muted-foreground">{driver.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getVehicleIcon(driver.vehicleType)}
                      <div className="text-sm">
                        <p className="font-medium capitalize">{driver.vehicleType}</p>
                        <p className="text-muted-foreground text-xs">{driver.vehiclePlateNumber}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{driver.region || "-"}</TableCell>
                  <TableCell>{getVerificationBadge(driver.verificationStatus)}</TableCell>
                  <TableCell>
                    {format(new Date(driver.joinedDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => handleViewActivity(driver)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Activity Log
                        </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleViewOngoingPickups(driver)}>
                          <Package className="mr-2 h-4 w-4 text-blue-600" />
                          View Ongoing Pickups
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewPickupHistory(driver)}>
                          <History className="mr-2 h-4 w-4 text-purple-600" />
                          View Pickup History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(driver)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Information
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {driver.verificationStatus === "pending" && (
                          <DropdownMenuItem onClick={() => handleVerify(driver)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Verify Driver
                          </DropdownMenuItem>
                        )}
                        
                        {!driver.hasSetPassword && (
                          <DropdownMenuItem onClick={() => handleResendPasswordLink(driver)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Resend Password Link
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          onClick={() => handleSuspend(driver)}
                          className="text-orange-600"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Suspend Account
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDisable(driver)}
                          className="text-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Disable Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {drivers.length} of {driversResponse?.data?.pagination?.total || 0} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
          {totalPages > 3 && <span className="text-muted-foreground">...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <CreateDriverDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {selectedDriver && (
        <>
          <EditDriverDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            driver={selectedDriver}
          />
          <DriverActivityLogsDrawer
            open={isActivityLogsOpen}
            onOpenChange={setIsActivityLogsOpen}
            driverId={selectedDriver._id}
            driverName={selectedDriver.fullName}
          />
            <DriverOngoingPickups
      open={isOngoingPickupsOpen}
      onOpenChange={setIsOngoingPickupsOpen}
      driver={selectedDriver}
    />
    <DriverPickupHistory
      open={isPickupHistoryOpen}
      onOpenChange={setIsPickupHistoryOpen}
      driver={selectedDriver}
    />
          <ResendPasswordLinkDialog
            open={isResendPasswordOpen}
            onOpenChange={setIsResendPasswordOpen}
            driver={selectedDriver}
          />
          <SuspendDriverDialog
            open={isSuspendDialogOpen}
            onOpenChange={setIsSuspendDialogOpen}
            driver={selectedDriver}
          />
          <DisableDriverDialog
            open={isDisableDialogOpen}
            onOpenChange={setIsDisableDialogOpen}
            driver={selectedDriver}
          />
          <VerifyDriverDialog
            open={isVerifyDialogOpen}
            onOpenChange={setIsVerifyDialogOpen}
            driver={selectedDriver}
          />
        </>
      )}
    </div>
  );
}

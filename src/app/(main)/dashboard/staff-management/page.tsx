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
  RotateCcw,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
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
import { StaffsResponse, useGetAllStaffQuery, type Staff } from "@/stores/services/staffApi";
import CreateStaffDialog from "./_components/create-staff-dialog";
import EditStaffDialog from "./_components/edit-staff-dialog";
import ActivityLogsDrawer from "./_components/activity-logs-drawer";
import ResetPasswordDialog from "./_components/reset-password-dialog";
import SuspendAccountDialog from "./_components/suspend-account-dialog";
import DisableAccountDialog from "./_components/disable-account-dialog";

export default function StaffManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActivityLogsOpen, setIsActivityLogsOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);

  const {
    data: staffResponse,
    isLoading,
    refetch,
  } = useGetAllStaffQuery({
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    limit,
  });

  const staff = staffResponse?.data || {} as StaffsResponse;
  const totalPages = staff?.pagination?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      active: { variant: "default", label: "Active" },
      suspended: { variant: "warning", label: "Suspended" },
      disabled: { variant: "destructive", label: "Disabled" },
      running: { variant: "default", label: "Running" },
    };

    const config = variants[status] || variants.active;
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
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
      setSelectedIds(staff.staffList.map((s) => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectStaff = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const handleViewActivity = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsActivityLogsOpen(true);
  };

  const handleEditRole = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsEditDialogOpen(true);
  };

  const handleResetPassword = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsResetPasswordOpen(true);
  };

  const handleSuspendAccount = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsSuspendDialogOpen(true);
  };

  const handleDisableAccount = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsDisableDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite New User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers"
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
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
            <SelectItem value="running">Running</SelectItem>
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
                  checked={selectedIds.length === staff.staffList.length && staff.staffList.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Region / Branch</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.staffList?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground h-32">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              staff.staffList.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(member._id)}
                      onCheckedChange={(checked) =>
                        handleSelectStaff(member._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.fullName} />
                        <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </TableCell>
                  <TableCell>{member.roleName || member.role}</TableCell>
                  <TableCell>
                    {member.region?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(member.joinedDate), "dd MMM yyyy - hh:mm a")}
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => handleViewActivity(member)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Activity Log
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditRole(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role / Permission
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(member)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSuspendAccount(member)}
                          className="text-orange-600"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {member.status === "suspended" ? "Unsuspend Account" : "Suspend Account"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDisableAccount(member)}
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
          Showing {staff.staffList?.length || 0} of {staff?.pagination?.total || 0} entries
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
      <CreateStaffDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {selectedStaff && (
        <>
          <EditStaffDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            staff={selectedStaff}
          />
          <ActivityLogsDrawer
            open={isActivityLogsOpen}
            onOpenChange={setIsActivityLogsOpen}
            userId={selectedStaff._id}
            userName={selectedStaff.fullName}
          />
          <ResetPasswordDialog
            open={isResetPasswordOpen}
            onOpenChange={setIsResetPasswordOpen}
            staff={selectedStaff}
          />
          <SuspendAccountDialog
            open={isSuspendDialogOpen}
            onOpenChange={setIsSuspendDialogOpen}
            staff={selectedStaff}
          />
          <DisableAccountDialog
            open={isDisableDialogOpen}
            onOpenChange={setIsDisableDialogOpen}
            staff={selectedStaff}
          />
        </>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  Search,
  Filter,
  Download,
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Award,
  Crown,
  Sparkles,
  Calendar,
  User,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types";

export const Route = createFileRoute("/admin/customers")({ component: CustomersAdmin });

function CustomersAdmin() { 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'spent'>('orders');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const query = useQuery({ 
    queryKey: ["admin-customers"], 
    queryFn: () => customerService.list() 
  });

  // Filter and search customers
  const filteredCustomers = useMemo(() => {
    let customers = query.data ?? [];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      customers = customers.filter(customer => 
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        (customer.phone && customer.phone.toLowerCase().includes(search))
      );
    }
    
    if (statusFilter !== 'all') {
      customers = customers.filter(customer => customer.status === statusFilter);
    }
    
    // Sort customers
    switch (sortBy) {
      case 'name':
        customers = [...customers].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'orders':
        customers = [...customers].sort((a, b) => b.orders - a.orders);
        break;
      case 'spent':
        customers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      default:
        break;
    }
    
    return customers;
  }, [query.data, searchTerm, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const customers = query.data ?? [];
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      blocked: customers.filter(c => c.status === 'blocked').length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      avgCustomerValue: customers.length > 0 
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length 
        : 0,
    };
  }, [query.data]);

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'blocked':
        return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return CheckCircle2;
      case 'blocked':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E5E5E5] pb-8"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] flex items-center gap-2">
            <Users className="size-4" />
            Community
          </p>
          <h1
            className="mt-4 text-4xl text-[#1A1A1A] md:text-6xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Customers
          </h1>
          <p className="mt-4 text-[13px] text-[#777777] uppercase tracking-[0.1em]">
            Manage and understand your customer base.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9]">
            <Download className="size-4" />
            Export
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#1A1A1A] bg-[#1A1A1A] px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black/80 hover:border-black/80">
            <UserPlus className="size-4" />
            Add customer
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Customers', value: stats.total, icon: Users },
          { label: 'Active', value: stats.active, icon: CheckCircle2 },
          { label: 'Blocked', value: stats.blocked, icon: XCircle },
          { label: 'Avg. Customer Value', value: formatPrice(stats.avgCustomerValue), icon: DollarSign },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative border border-[#E5E5E5] bg-white p-6 transition-all hover:border-[#1A1A1A]"
          >
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center justify-center">
                  <stat.icon className="size-5 text-[#1A1A1A]" />
                </div>
                {index === 0 && <TrendingUp className="size-4 text-emerald-600" />}
              </div>

              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">
                {stat.label}
              </p>
              <p
                className="mt-2 text-3xl md:text-4xl text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
              >
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#777777]" />
          <input
            type="search"
            placeholder="SEARCH CUSTOMERS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
          />
        </div>

        {/* Filters & View Mode */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9] flex-1 sm:flex-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-4" />
            Filters
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-12 px-4 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none flex-1 sm:flex-none appearance-none"
          >
            <option value="orders">MOST ORDERS</option>
            <option value="name">NAME</option>
            <option value="spent">HIGHEST SPENT</option>
          </select>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center border border-[#E5E5E5] bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-3 h-12 transition-all",
                viewMode === 'grid' 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'text-[#777777] hover:bg-[#F9F9F9]'
              )}
            >
              <BarChart3 className="size-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-3 h-12 transition-all border-l border-[#E5E5E5]",
                viewMode === 'list' 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'text-[#777777] hover:bg-[#F9F9F9]'
              )}
            >
              <Users className="size-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border border-[#E5E5E5] bg-[#F9F9F9]">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] block mb-3">Customer Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'active', 'blocked'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors border",
                        statusFilter === status
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#777777] border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A]'
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customers Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          viewMode === 'grid' 
            ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' 
            : 'space-y-4'
        )}
      >
        {paginatedCustomers.map((customer, index) => {
          const StatusIcon = getStatusIcon(customer.status);
          
          if (viewMode === 'grid') {
            return (
              <motion.article
                key={customer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative border border-[#E5E5E5] bg-white p-6 hover:border-[#1A1A1A] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="size-12 bg-[#1A1A1A] flex items-center justify-center text-lg font-bold text-white uppercase">
                      {getCustomerInitials(customer.name)}
                    </div>
                    <span className={cn(
                      "absolute -bottom-1 -right-1 size-3 border-2 border-white",
                      customer.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] truncate">{customer.name}</h2>
                    <p className="mt-1 text-[10px] text-[#777777] truncate">{customer.email}</p>
                    {customer.phone && (
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777] flex items-center gap-2">
                        <Phone className="size-3" />
                        {customer.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-[#E5E5E5] pt-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                    <ShoppingBag className="size-3 text-[#777777]" />
                    {customer.orders} orders
                  </div>
                  <strong className="text-[14px] font-bold text-[#1A1A1A]">{formatPrice(customer.totalSpent)}</strong>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 h-10 border border-[#E5E5E5] bg-white text-[10px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <Eye className="size-3" />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 h-10 border border-[#E5E5E5] bg-white text-[10px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors">
                    <Mail className="size-3" />
                    Email
                  </button>
                </div>
              </motion.article>
            );
          }
          
          // List view
          return (
            <motion.article
              key={customer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-6 p-4 border border-[#E5E5E5] bg-white hover:border-[#1A1A1A] transition-colors"
            >
              <div className="relative">
                <div className="size-10 bg-[#1A1A1A] flex items-center justify-center font-bold text-white uppercase text-sm">
                  {getCustomerInitials(customer.name)}
                </div>
                <span className={cn(
                  "absolute -bottom-0.5 -right-0.5 size-3 border-2 border-white",
                  customer.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] truncate">{customer.name}</h2>
                <p className="mt-1 text-[10px] text-[#777777] truncate">{customer.email}</p>
              </div>
              
              <div className="hidden sm:block">
                <p className="text-[12px] font-bold text-[#1A1A1A]">{customer.orders}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#777777]">Orders</p>
              </div>
              
              <div className="hidden md:block">
                <p className="text-[12px] font-bold text-[#1A1A1A]">{formatPrice(customer.totalSpent)}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#777777]">Total spent</p>
              </div>
              
              <span className={cn(
                "inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-bold uppercase tracking-[0.1em]",
                customer.status === 'active'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              )}>
                <StatusIcon className="size-3" />
                {customer.status}
              </span>
              
              <button
                className="p-2 border border-transparent text-[#777777] hover:border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A] transition-all"
                onClick={() => setSelectedCustomer(customer.id)}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {paginatedCustomers.length === 0 && (
        <div className="p-12 border border-[#E5E5E5] bg-white text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">No customers found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-[#E5E5E5] bg-white hover:bg-[#F9F9F9] transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "size-8 flex items-center justify-center border text-[11px] font-bold transition-colors",
                  currentPage === page
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#E5E5E5] bg-white text-[#1A1A1A] hover:bg-[#F9F9F9]"
                )}
              >
                {page}
              </button>
            ))}
            <button
              className="p-2 border border-[#E5E5E5] bg-white hover:bg-[#F9F9F9] transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl border border-[#E5E5E5] bg-white p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-6">
                <h2
                  className="text-3xl text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
                >
                  Customer Details
                </h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-3 border border-transparent hover:border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
                >
                  <XCircle className="size-5 text-[#1A1A1A]" />
                </button>
              </div>
              {/* Add detailed customer information here */}
              {(() => { const customer = query.data?.find((item) => item.id === selectedCustomer); return customer ? <div className="mt-8 grid gap-6 text-sm sm:grid-cols-2"><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Name</p><p className="mt-2 text-[14px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{customer.name}</p></div><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Status</p><p className="mt-2 text-[14px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{customer.status}</p></div><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Email</p><p className="mt-2 text-[12px] text-[#1A1A1A] break-all">{customer.email}</p></div><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Phone</p><p className="mt-2 text-[14px] font-bold text-[#1A1A1A]">{customer.phone || 'N/A'}</p></div><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Orders</p><p className="mt-2 text-[14px] font-bold text-[#1A1A1A]">{customer.orders}</p></div><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Total spent</p><p className="mt-2 text-[14px] font-bold text-[#1A1A1A]">{formatPrice(customer.totalSpent)}</p></div></div> : null; })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
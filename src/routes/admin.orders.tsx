import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import type { OrderStatus, PaymentStatus } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Users,
  TrendingUp,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/orders")({ component: OrdersAdmin });

function OrdersAdmin() {
  const { formatPrice } = useCurrency();
  const client = useQueryClient(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'total-asc' | 'total-desc'>('newest');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const itemsPerPage = 10;

  const query = useQuery({ 
    queryKey: ["admin-orders"], 
    queryFn: () => orderService.list() 
  });

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let orders = query.data ?? [];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      orders = orders.filter(order => 
        order.reference.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search)
      );
    }
    
    if (statusFilter !== 'all') {
      orders = orders.filter(order => order.status === statusFilter);
    }
    
    if (paymentFilter !== 'all') {
      orders = orders.filter(order => order.paymentStatus === paymentFilter);
    }
    
    // Sort orders
    switch (sortBy) {
      case 'oldest':
        orders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'total-asc':
        orders = [...orders].sort((a, b) => a.total - b.total);
        break;
      case 'total-desc':
        orders = [...orders].sort((a, b) => b.total - a.total);
        break;
      default: // newest
        orders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    return orders;
  }, [query.data, searchTerm, statusFilter, paymentFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const orders = query.data ?? [];
    return {
      total: orders.length,
      pending: orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
      shipped: orders.filter(o => ['shipped', 'out-for-delivery'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    };
  }, [query.data]);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setIsUpdating(true);
    try {
      await orderService.updateStatus(orderId, status);
      await client.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async (orderId: string, paymentStatus: PaymentStatus) => {
    setIsUpdating(true);
    setPaymentMessage("");
    try {
      await orderService.updatePayment(orderId, paymentStatus);
      await client.invalidateQueries({ queryKey: ["admin-orders"] });
      setPaymentMessage("Refund recorded. Points from this order have been reversed.");
    } catch (error) {
      setPaymentMessage(error instanceof Error ? error.message : "The refund could not be recorded.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
      case 'processing':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400';
      case 'out-for-delivery':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'cancelled':
        return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'confirmed':
        return CheckCircle2;
      case 'processing':
        return Package;
      case 'shipped':
        return Truck;
      case 'out-for-delivery':
        return Truck;
      case 'delivered':
        return CheckCircle2;
      case 'cancelled':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getPaymentColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
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
            <ShoppingBag className="size-4" />
            Fulfilment
          </p>
          <h1
            className="mt-4 text-4xl text-[#1A1A1A] md:text-6xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Orders
          </h1>
          <p className="mt-4 text-[13px] text-[#777777] uppercase tracking-[0.1em]">
            Track and manage customer orders.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9]">
            <Download className="size-4" />
            Export
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9]">
            <RefreshCw className="size-4" />
            Refresh
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
          { label: 'Total Orders', value: stats.total, icon: ShoppingBag },
          { label: 'Pending', value: stats.pending, icon: Clock },
          { label: 'Shipped', value: stats.shipped, icon: Truck },
          { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign },
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
                {index === 3 ? <TrendingUp className="size-4 text-emerald-600" /> : null}
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
            placeholder="SEARCH ORDERS BY REFERENCE OR CUSTOMER..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
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
            <option value="newest">NEWEST</option>
            <option value="oldest">OLDEST</option>
            <option value="total-asc">TOTAL: LOW TO HIGH</option>
            <option value="total-desc">TOTAL: HIGH TO LOW</option>
          </select>
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
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] block mb-3">Order Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'] as const).map(status => (
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
                        {status.replaceAll('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] block mb-3">Payment Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'paid', 'unpaid', 'failed'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setPaymentFilter(status)}
                        className={cn(
                          "px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors border",
                          paymentFilter === status
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-x-auto border border-[#E5E5E5] bg-white"
      >
        <table className="w-full min-w-[800px] text-left">
          <thead className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
            <tr className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {paginatedOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#F9F9F9] transition-colors"
                >
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#777777] transition-colors"
                    >
                      {order.reference}
                    </button>
                    <span className="block mt-1 text-[10px] uppercase tracking-[0.1em] text-[#777777]">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="size-8 bg-[#1A1A1A] flex items-center justify-center shrink-0">
                        <Users className="size-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{order.customerName}</p>
                        <p className="mt-1 text-[10px] text-[#777777]">{order.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[12px] font-bold text-[#1A1A1A]">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={async (event) => {
                          await handleStatusUpdate(order.id, event.target.value as OrderStatus);
                        }}
                        disabled={isUpdating}
                        className={cn(
                          "appearance-none pl-8 pr-8 py-2 text-[10px] font-bold uppercase tracking-[0.1em] border cursor-pointer focus:outline-none transition-all",
                          order.status === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                          order.status === 'cancelled' ? 'border-red-200 bg-red-50 text-red-700' :
                          'border-[#E5E5E5] bg-white text-[#1A1A1A]',
                          isUpdating && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {["pending", "confirmed", "processing", "shipped", "out-for-delivery", "delivered", "cancelled"].map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("-", " ")}
                          </option>
                        ))}
                      </select>
                      <StatusIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3 pointer-events-none" />
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 size-3 pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-bold uppercase tracking-[0.1em]",
                      order.paymentStatus === 'paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                      order.paymentStatus === 'failed' ? 'border-red-200 bg-red-50 text-red-700' :
                      'border-yellow-200 bg-yellow-50 text-yellow-700'
                    )}>
                      {order.paymentStatus === 'paid' && <CheckCircle2 className="size-3" />}
                      {order.paymentStatus === 'unpaid' && <Clock className="size-3" />}
                      {order.paymentStatus === 'failed' && <XCircle className="size-3" />}
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 border border-transparent text-[#777777] hover:border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A] transition-all"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        className="p-2 border border-transparent text-[#777777] hover:border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A] transition-all"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {paginatedOrders.length === 0 && (
          <div className="p-12 border border-[#E5E5E5] bg-white text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">No orders found</p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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
      
      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
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
              onClick={() => setSelectedOrder(null)}
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
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-3 border border-transparent hover:border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
                >
                  <XCircle className="size-5 text-[#1A1A1A]" />
                </button>
              </div>
              {/* Detailed order information */}
              {(() => { const order = query.data?.find((item) => item.id === selectedOrder); return order ? <div className="mt-8 grid gap-6 text-sm sm:grid-cols-2"><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Customer</p><p className="mt-2 text-[14px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{order.customerName}</p><p className="mt-1 text-[12px] text-[#777777]">{order.customerEmail}</p></div><div className="p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Total</p><p className="mt-2 text-[14px] font-bold text-[#1A1A1A]">{formatPrice(order.total)}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777]">{order.paymentStatus}</p></div><div className="sm:col-span-2 p-4 border border-[#E5E5E5]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">Delivery address</p><p className="mt-2 text-[12px] uppercase tracking-[0.1em] text-[#1A1A1A]">{order.address.street}, {order.address.city}, {order.address.state}</p></div><div className="sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777] mb-4">Items</p><div className="space-y-3">{order.items.map((item) => <div key={`${item.slug}-${item.size}`} className="flex justify-between border border-[#E5E5E5] p-4"><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{item.name} × {item.quantity}</span><span className="text-[12px] font-bold text-[#1A1A1A]">{formatPrice(item.price * item.quantity)}</span></div>)}</div></div></div> : null; })()}
              {query.data?.find((item) => item.id === selectedOrder)?.paymentStatus === "paid" ? (
                <div className="mt-6 border-t border-[#E5E5E5] pt-5">
                  <p className="text-xs text-[#777777]">Record this after the customer’s money has been refunded.</p>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => {
                      if (window.confirm("Confirm the customer has received their refund? The points from this order will be removed.")) {
                        void handlePaymentUpdate(selectedOrder, "refunded");
                      }
                    }}
                    className="mt-3 h-10 border border-red-300 px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-red-700 disabled:opacity-50"
                  >
                    Mark refund complete
                  </button>
                  {paymentMessage ? <p role="status" className="mt-3 text-sm">{paymentMessage}</p> : null}
                </div>
              ) : null}
              {paymentMessage && query.data?.find((item) => item.id === selectedOrder)?.paymentStatus !== "paid" ? (
                <p role="status" className="mt-4 text-sm">{paymentMessage}</p>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
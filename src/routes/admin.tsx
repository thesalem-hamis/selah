import { createFileRoute, Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout, AdminLogin } from "@/components/store/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/lib/format";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Package,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  BarChart3,
  Users,
  Star,
  Activity,
  MoreHorizontal,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect, useCallback, memo } from "react";

export const Route = createFileRoute("/admin")({ component: AdminHome });

// Loading component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="size-12 rounded-full border-4 border-primary/30 border-t-primary"
        />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  );
}

// AdminGate component - simplified and memoized
const AdminGate = ({ children }: { children: ReactNode }) => {
  const { isAdmin, ready, user } = useAuth();

  // While we rehydrate the session, show a loader
  if (!ready) {
    return <LoadingScreen />;
  }

  // Not signed in at all: show the admin login form (its own success handler
  // will either show the admin area or kick the user back to /login).
  if (!user) {
    return <AdminLogin />;
  }

  // Signed in but not an admin: send them to the regular login page so they
  // can sign in with a different account.
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render children with AdminLayout
  return <AdminLayout>{children}</AdminLayout>;
};

export const MemoizedAdminGate = memo(AdminGate);

function AdminHome() {
  const { pathname } = useLocation();
  const isOverview = pathname === "/admin";

  // Determine what to render (memoized so the children prop stays referentially stable)
  const content = useMemo(() => (isOverview ? <Overview /> : <Outlet />), [isOverview]);

  return <MemoizedAdminGate>{content}</MemoizedAdminGate>;
}

function Overview() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const analytics = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: () => orderService.analytics(timeRange === "90d" ? "3m" : timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => orderService.list(),
    staleTime: 60 * 1000,
  });

  const data = useMemo(() => analytics.data, [analytics.data]);
  const orderRows = useMemo(() => orders.data ?? [], [orders.data]);

  const timeRanges = useMemo(
    () => [
      { value: "7d", label: "7 days" },
      { value: "30d", label: "30 days" },
      { value: "90d", label: "90 days" },
    ],
    [],
  );

  const stats = useMemo(
    () => [
      {
        label: "Revenue",
        value: formatPrice(data?.revenue ?? 0),
        icon: DollarSign,
        change: data?.revenueChange ?? "+12.5%",
        trend: (data?.revenueChange ?? "+12.5%").startsWith("+") ? "up" : "down",
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      },
      {
        label: "Orders",
        value: data?.orders ?? 0,
        icon: ShoppingBag,
        change: data?.ordersChange ?? "+8.2%",
        trend: (data?.ordersChange ?? "+8.2%").startsWith("+") ? "up" : "down",
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
      },
      {
        label: "Units Sold",
        value: data?.unitsSold ?? 0,
        icon: Package,
        change: data?.unitsSoldChange ?? "+15.3%",
        trend: (data?.unitsSoldChange ?? "+15.3%").startsWith("+") ? "up" : "down",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50 dark:bg-purple-950/20",
      },
      {
        label: "Avg. Order Value",
        value: formatPrice(data?.averageOrderValue ?? 0),
        icon: Activity,
        change: data?.aovChange ?? "-2.1%",
        trend: (data?.aovChange ?? "-2.1%").startsWith("+") ? "up" : "down",
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
      },
    ],
    [data],
  );

  const storeHealth = useMemo(
    () => [
      {
        label: "Pending orders",
        value: data?.pendingOrders ?? 0,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      },
      {
        label: "Low stock pieces",
        value: data?.lowStock ?? 0,
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
      },
      {
        label: "Out of stock",
        value: data?.outOfStock ?? 0,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/20",
      },
    ],
    [data],
  );

  const topProducts = useMemo(() => data?.topProducts?.slice(0, 4) ?? [], [data?.topProducts]);

  const recentActivity = useMemo(
    () => [
      {
        icon: Users,
        label: "New customers",
        value: String(data?.newCustomers ?? 0),
        change: "+18%",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: Star,
        label: "Active products",
        value: String(data?.totalProducts ?? 0),
        change: "+0.2",
        color: "from-yellow-500 to-amber-500",
      },
      {
        icon: CheckCircle2,
        label: "Completed orders",
        value: String(orderRows.filter((o) => o.status === "delivered").length),
        change: "+12%",
        color: "from-emerald-500 to-green-500",
      },
    ],
    [data, orderRows],
  );

  const handleTimeRangeChange = useCallback((range: typeof timeRange) => {
    setTimeRange(range);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await analytics.refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [analytics.refetch]);

  const handleDownload = useCallback(() => {
    // Implement download functionality
    console.log("Download report");
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <p className="eyebrow text-primary flex items-center gap-2">
            <BarChart3 className="size-4" />
            Studio overview
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Good morning.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex rounded-lg border border-border bg-background p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value as typeof timeRange)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timeRange === range.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {range.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Download className="size-4" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 transition-all hover:shadow-lg"
          >
            {/* Background gradient */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                "bg-gradient-to-br",
                stat.color,
              )}
            />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center",
                    stat.bgColor,
                  )}
                >
                  <stat.icon className="size-5 text-primary" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    stat.trend === "up" ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {stat.change}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-display text-3xl">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Health */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-background p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Store health</h2>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <MoreHorizontal className="size-4" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {storeHealth.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-10 rounded-lg flex items-center justify-center",
                      item.bgColor,
                    )}
                  >
                    <item.icon className={cn("size-5", item.color)} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="font-semibold text-lg">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Products */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-background p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Top pieces</h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>

          <div className="mt-6 space-y-4">
            {topProducts.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Star className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">#{index + 1} best seller</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.units} sold</p>
                  <p className="text-xs text-muted-foreground">
                    {((item.units / (data?.unitsSold || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}

            {!topProducts.length && (
              <div className="text-center py-8 text-muted-foreground">No sales data yet</div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Recent Activity */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-border bg-background p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent activity</h2>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Calendar className="size-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {recentActivity.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className="p-4 rounded-lg border border-border/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                    item.color,
                  )}
                >
                  <item.icon className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.change} this period</p>
                </div>
              </div>
              <p className="mt-3 font-display text-2xl">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

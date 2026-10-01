import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  Sparkles,
  Star,
  Award,
  Clock,
  Zap,
  ChevronDown,
  Filter,
  Maximize2,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsAdmin });

type TimeRange = '7d' | '30d' | '90d' | '12m';

function AnalyticsAdmin() { 
  const [timeRange, setTimeRange] = useState<TimeRange>('12m');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  
  const query = useQuery({ 
    queryKey: ["analytics", timeRange], 
    queryFn: () => orderService.analytics(timeRange as '7d' | '30d' | '12m' | 'today' | '3m') 
  }); 
  const data = query.data;

  // Calculate additional metrics
  const metrics = useMemo(() => {
    if (!data) return null;
    
    const totalOrders = data.orders ?? 0;
    const totalRevenue = data.revenue ?? 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const customerCount = data.customers ?? 0;
    
    return {
      ...data,
      averageOrderValue,
      ordersPerCustomer: customerCount > 0 ? totalOrders / customerCount : 0,
      revenuePerCustomer: customerCount > 0 ? totalRevenue / customerCount : 0,
    };
  }, [data]);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: '12m', label: '12 months' },
  ];

  const stats = [
    {
      label: 'Paid Revenue',
      value: formatPrice(metrics?.paidRevenue ?? 0),
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      label: 'Total Customers',
      value: metrics?.customers ?? 0,
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      label: 'Conversion Rate',
      value: `${metrics?.conversionRate ?? 0}%`,
      change: '+2.4%',
      trend: 'up' as const,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      label: 'Avg. Order Value',
      value: formatPrice(metrics?.averageOrderValue ?? 0),
      change: '-1.2%',
      trend: 'down' as const,
      icon: ShoppingBag,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  // Calculate max revenue for chart scaling
  const maxRevenue = useMemo(() => {
    if (!data?.series?.length) return 1;
    const revenues = data.series.map(item => item.revenue);
    return Math.max(...revenues, 1);
  }, [data?.series]);

  const renderBarChart = () => (
    <div className="flex h-64 items-end gap-2 border-b border-l border-border px-4 pt-4">
      {data?.series.map((point, index) => {
        const height = (point.revenue / maxRevenue) * 100;
        return (
          <motion.div
            key={point.month}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${Math.max(8, height)}%`, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group relative flex flex-1 flex-col items-center justify-end gap-2"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg z-10">
              {formatPrice(point.revenue)}
            </div>
            <motion.div 
              className={cn(
                "w-full max-w-12 rounded-t-lg transition-all cursor-pointer",
                "bg-gradient-to-t from-primary/60 to-primary/20",
                "hover:from-primary hover:to-primary/40"
              )}
              style={{ height: `${Math.max(8, height)}%` }}
              whileHover={{ scaleX: 1.1 }}
            />
            <span className="text-[10px] text-muted-foreground">
              {point.month}
            </span>
          </motion.div>
        );
      })}
    </div>
  );

  const renderLineChart = () => {
    const points = data?.series ?? [];
    const chartWidth = 100;
    const chartHeight = 50;
    
    const coordinates = points.map((point, index) => {
      const x = points.length > 1 ? (index / (points.length - 1)) * chartWidth : chartWidth / 2;
      const y = chartHeight - (point.revenue / maxRevenue) * chartHeight;
      return { x, y, ...point };
    });

    const linePath = coordinates.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="relative h-64">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line 
              key={y}
              x1="0" 
              y1={y} 
              x2={chartWidth} 
              y2={y} 
              stroke="hsl(var(--border))" 
              strokeWidth="0.5"
            />
          ))}
          
          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {coordinates.map((point, index) => (
            <motion.circle
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="hsl(var(--primary))"
              className="cursor-pointer"
            >
              <title>{`${point.month}: ${formatPrice(point.revenue)}`}</title>
            </motion.circle>
          ))}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {points.map((point) => (
            <span key={point.month} className="text-[10px] text-muted-foreground">
              {point.month}
            </span>
          ))}
        </div>
      </div>
    );
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
            <BarChart3 className="size-4" />
            Performance
          </p>
          <h1
            className="mt-4 text-4xl text-[#1A1A1A] md:text-6xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Analytics
          </h1>
          <p className="mt-4 text-[13px] text-[#777777] uppercase tracking-[0.1em]">
            Track your store's performance and growth.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9]">
            <Download className="size-4" />
            Export report
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-4 h-12 text-[#1A1A1A] transition-colors hover:bg-[#F9F9F9]">
            <RefreshCw className="size-4" />
          </button>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={cn(
              "px-6 h-12 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors border",
              timeRange === range.value
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#777777] border-[#E5E5E5] hover:bg-[#F9F9F9] hover:text-[#1A1A1A]'
            )}
          >
            {range.label}
          </button>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative border border-[#E5E5E5] bg-white p-6 transition-all hover:border-[#1A1A1A]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center justify-center">
                <stat.icon className="size-5 text-[#1A1A1A]" />
              </div>
              <span className={cn(
                "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em]",
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              )}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {stat.change}
              </span>
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
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border border-[#E5E5E5] bg-white p-8"
      >
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E5E5E5]">
          <div>
            <h2
              className="text-3xl text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
            >
              Revenue overview
            </h2>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
              Monthly revenue performance
            </p>
          </div>
          
          {/* Chart Type Toggle */}
          <div className="flex items-center border border-[#E5E5E5] bg-white">
            <button
              onClick={() => setChartType('bar')}
              className={cn(
                "p-3 h-12 transition-all",
                chartType === 'bar' 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'text-[#777777] hover:bg-[#F9F9F9]'
              )}
              title="Bar chart"
            >
              <BarChart3 className="size-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={cn(
                "p-3 h-12 transition-all border-l border-[#E5E5E5]",
                chartType === 'line' 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'text-[#777777] hover:bg-[#F9F9F9]'
              )}
              title="Line chart"
            >
              <LineChart className="size-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={chartType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {chartType === 'bar' ? (
              <div className="flex h-64 items-end gap-3 border-b border-l border-[#E5E5E5] px-4 pt-4">
                {data?.series.map((point, index) => {
                  const height = (point.revenue / maxRevenue) * 100;
                  return (
                    <motion.div
                      key={point.month}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${Math.max(8, height)}%`, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                      className="group relative flex flex-1 flex-col items-center justify-end gap-3"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A1A1A] text-white border border-[#1A1A1A] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap z-10 pointer-events-none">
                        {formatPrice(point.revenue)}
                      </div>
                      <motion.div 
                        className={cn(
                          "w-full max-w-[40px] transition-all cursor-pointer",
                          "bg-[#1A1A1A]",
                          "hover:bg-[#333333]"
                        )}
                        style={{ height: `${Math.max(8, height)}%` }}
                        whileHover={{ scaleX: 1.05 }}
                      />
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                        {point.month}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : renderLineChart()}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* Detailed Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border border-[#E5E5E5] bg-white p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-3xl text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
            >
              Detailed statistics
            </h2>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
              Key performance indicators
            </p>
          </div>
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="p-3 border border-transparent hover:border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
          >
            <ChevronDown className={cn(
              "size-5 text-[#1A1A1A] transition-transform",
              showDetailedStats && "rotate-180"
            )} />
          </button>
        </div>

        <AnimatePresence>
          {showDetailedStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 pt-8 border-t border-[#E5E5E5] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    label: 'Average Order Value', 
                    value: formatPrice(metrics?.averageOrderValue ?? 0),
                    icon: ShoppingBag
                  },
                  { 
                    label: 'Orders per Customer', 
                    value: metrics?.ordersPerCustomer?.toFixed(1) ?? '0',
                    icon: Activity
                  },
                  { 
                    label: 'Revenue per Customer', 
                    value: formatPrice(metrics?.revenuePerCustomer ?? 0),
                    icon: DollarSign
                  },
                  { 
                    label: 'Top Product', 
                    value: data?.topProducts?.[0]?.name ?? 'N/A',
                    icon: Star
                  },
                  { 
                    label: 'Units Sold', 
                    value: data?.unitsSold ?? 0,
                    icon: ShoppingBag
                  },
                  { 
                    label: 'Peak Month', 
                    value: data?.series?.reduce((max, p) => {
                      if (!max || p.revenue > max.revenue) return p;
                      return max;
                    }, undefined as typeof data.series[0] | undefined)?.month ?? 'N/A',
                    icon: TrendingUp
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-[#1A1A1A] flex items-center justify-center shrink-0">
                        <item.icon className="size-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#777777]">{item.label}</p>
                        <p className="mt-1 text-[14px] font-bold text-[#1A1A1A] truncate">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Top Products */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="border border-[#E5E5E5] bg-white p-8"
      >
        <h2
          className="text-3xl text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
        >
          Top performing products
        </h2>
        <div className="mt-8 space-y-4">
          {data?.topProducts?.slice(0, 5).map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + index * 0.05 }}
              className="flex items-center gap-6 p-4 border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors bg-[#F9F9F9]"
            >
              <div className="size-10 bg-[#1A1A1A] text-white flex items-center justify-center text-[12px] font-bold">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] truncate">{product.name}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  {product.units} units sold
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-bold text-[#1A1A1A]">{formatPrice(product.revenue ?? 0)}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  {((product.units / (data?.unitsSold || 1)) * 100).toFixed(1)}% of sales
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
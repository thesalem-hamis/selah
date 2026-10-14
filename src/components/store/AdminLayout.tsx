import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  ChevronRight,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Crown,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, description: "Dashboard" },
  { to: "/admin/products", label: "Products", icon: Boxes, description: "Manage inventory" },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList, description: "Track orders" },
  { to: "/admin/customers", label: "Customers", icon: Users, description: "Customer list" },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Insights & reports",
  },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const notifications = [
    {
      id: 1,
      title: "New order received",
      description: "Order #1234 from UK",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Low stock alert",
      description: "3 products running low",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Payment received",
      description: "Order #1230 payment confirmed",
      time: "3 hours ago",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white text-[#1A1A1A]"
      >
        <div className="container-page flex h-[5rem] items-center justify-between">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-[#F9F9F9] transition-colors"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-selah)", fontWeight: 400 }}>
                SELAH GIRL <span className="text-[10px] font-sans uppercase tracking-[0.3em] font-bold text-[#777777]">STUDIO</span>
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#777777]" />
              <input
                type="search"
                placeholder="SEARCH ORDERS, PRODUCTS..."
                className="w-full h-12 pl-12 pr-4 border border-[#E5E5E5] bg-transparent text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] placeholder:text-[#BBBBBB] focus:border-[#1A1A1A] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-3 hover:bg-[#F9F9F9] transition-colors border border-transparent hover:border-[#E5E5E5]"
              >
                <Bell className="size-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-2 right-2 size-2 bg-red-600" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 border border-[#1A1A1A] bg-white shadow-2xl z-50"
                  >
                    <div className="p-4 border-b border-[#E5E5E5] bg-[#1A1A1A] text-white">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={cn(
                            "w-full text-left p-4 hover:bg-[#F9F9F9] transition-colors border-b border-[#E5E5E5]",
                            notification.unread && "bg-[#F9F9F9]",
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-[#1A1A1A]">{notification.title}</p>
                              <p className="text-[12px] text-[#444444] mt-1">
                                {notification.description}
                              </p>
                              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777] mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <span className="size-2 bg-[#1A1A1A] shrink-0 mt-1" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-[#F9F9F9] transition-colors border border-transparent hover:border-[#E5E5E5]"
              >
                <div className="size-8 bg-[#1A1A1A] flex items-center justify-center text-[12px] font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{user?.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#777777]">Administrator</p>
                </div>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 border border-[#1A1A1A] bg-white shadow-2xl z-50"
                  >
                    <div className="p-4 border-b border-[#E5E5E5] bg-[#1A1A1A] text-white">
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em]">{user?.name}</p>
                      <p className="text-[10px] text-[#BBBBBB] mt-1">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 p-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors">
                        <Settings className="size-4" />
                        Settings
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors">
                        <Shield className="size-4" />
                        Security
                      </button>
                      <div className="h-px bg-[#E5E5E5] my-2" />
                      <button
                         onClick={logout}
                        className="w-full flex items-center gap-3 p-3 text-[11px] font-bold uppercase tracking-[0.1em] text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        {/* Sidebar */}
        <aside className="min-w-0 lg:sticky lg:top-[7rem] lg:flex lg:h-[calc(100vh-8rem)] lg:flex-col lg:justify-between">
          <div className="mb-6 hidden items-center gap-2 px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777] lg:flex">
            <Package className="size-3" />
            Workspace
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden"
              >
                <div className="space-y-1 bg-white border border-[#E5E5E5] p-2 mb-6">
                  {links.map(({ to, label, icon: Icon }) => {
                    const active = pathname === to || (to !== "/admin" && pathname.startsWith(to));
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={cn(
                          "flex items-center gap-3 px-4 py-4 text-[11px] font-bold uppercase tracking-[0.1em] transition-all",
                          active
                            ? "bg-[#1A1A1A] text-white"
                            : "text-[#1A1A1A] hover:bg-[#F9F9F9]",
                        )}
                      >
                        <Icon className="size-4" />
                        <span>{label}</span>
                        {active && <ChevronRight className="size-4 ml-auto" />}
                      </Link>
                    );
                  })}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <div className="space-y-1 bg-white border border-[#E5E5E5] p-2">
              {links.map(({ to, label, icon: Icon }) => {
                const active = pathname === to || (to !== "/admin" && pathname.startsWith(to));
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "group relative flex items-center gap-4 px-4 py-4 text-[11px] font-bold uppercase tracking-[0.1em] transition-all",
                      active
                        ? "bg-[#1A1A1A] text-white"
                        : "text-[#777777] hover:bg-[#F9F9F9] hover:text-[#1A1A1A]",
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1">{label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Studio Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 border border-[#E5E5E5] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#777777]">
                  Studio status
                </p>
                <Sparkles className="size-4 text-[#1A1A1A]" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                  <span className="relative flex size-2">
                    <span className="relative inline-flex size-2 bg-emerald-500" />
                  </span>
                  Operational
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                  <TrendingUp className="size-3 text-[#1A1A1A]" />
                  Sales up 12.5%
                </div>
              </div>
            </motion.div>

            <button
              type="button"
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center gap-3 border border-red-200 bg-white px-4 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Sign out of Studio
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="min-w-0"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export function AdminLogin() {
  const { adminLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const form = new FormData(event.currentTarget);
      await adminLogin(String(form.get("email")), String(form.get("password")));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Administrator sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // If the user just signed in successfully, the parent AdminGate will re-render
  // and show the admin area automatically. Nothing to do here.

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute -top-20 -right-20 size-96 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-40 -left-20 size-[500px] rounded-full bg-primary/20 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-background/80 backdrop-blur-xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto mb-6 size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Crown className="size-8 text-primary-foreground" />
          </motion.div>

          <div className="text-center">
            <p className="eyebrow text-primary flex items-center justify-center gap-2">
              <Sparkles className="size-4" />
              Selah studio
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your store and track performance.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Email address</span>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@selah.store"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-11 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 h-11 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
                Signing in...
              </>
            ) : (
              <>
                Enter dashboard
                <ArrowRight className="size-4" />
              </>
            )}
          </button>

          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="size-3.5 text-primary" />
            Protected by secure authentication
          </div>
        </form>
      </motion.div>
    </div>
  );
}

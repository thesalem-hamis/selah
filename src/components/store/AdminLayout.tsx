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
    <div className="theme-admin min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar text-sidebar-foreground backdrop-blur-lg bg-opacity-95"
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link to="/" className="group flex items-center gap-3">
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 text-sm font-bold text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
              >
                S
              </motion.span>
              <span className="font-display text-2xl tracking-tight">
                Selah{" "}
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-sidebar-foreground/55">
                  Studio
                </span>
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-sidebar-foreground/50" />
              <input
                type="search"
                placeholder="Search orders, products..."
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <Bell className="size-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-sidebar-border bg-background shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={cn(
                            "w-full text-left p-4 hover:bg-muted/50 transition-colors border-b border-border/50",
                            notification.unread && "bg-primary/5",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "size-8 rounded-lg flex items-center justify-center shrink-0",
                                notification.unread ? "bg-primary/10" : "bg-muted",
                              )}
                            >
                              <Bell className="size-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <span className="size-2 rounded-full bg-primary shrink-0 mt-1" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-border">
                      <button className="w-full p-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium leading-tight">{user?.name}</p>
                  <p className="text-xs text-sidebar-foreground/60">Administrator</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-sidebar-border bg-background shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-2 p-2 text-sm hover:bg-muted rounded-lg transition-colors">
                        <Settings className="size-4" />
                        Settings
                      </button>
                      <button className="w-full flex items-center gap-2 p-2 text-sm hover:bg-muted rounded-lg transition-colors">
                        <Shield className="size-4" />
                        Security
                      </button>
                      <div className="h-px bg-border my-2" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
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
      <div className="container-page grid gap-5 py-4 lg:grid-cols-[240px_1fr] lg:gap-6 lg:py-6">
        {/* Sidebar */}
        <aside className="min-w-0 lg:sticky lg:top-[4.5rem] lg:flex lg:h-[calc(100vh-5rem)] lg:flex-col lg:justify-between">
          <div className="mb-2 hidden items-center gap-2 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground lg:flex">
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
                <div className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-sm">
                  {links.map(({ to, label, icon: Icon, description }) => {
                    const active = pathname === to || (to !== "/admin" && pathname.startsWith(to));
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          active
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted",
                        )}
                      >
                        <Icon className="size-5" />
                        <div>
                          <p>{label}</p>
                          <p className="text-xs opacity-75">{description}</p>
                        </div>
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
            <div className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-sm">
              {links.map(({ to, label, icon: Icon, description }) => {
                const active = pathname === to || (to !== "/admin" && pathname.startsWith(to));
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 transition-transform group-hover:scale-110",
                        active && "text-primary-foreground",
                      )}
                    />
                    <div className="flex-1">
                      <p>{label}</p>
                      <p
                        className={cn(
                          "text-xs",
                          active ? "text-primary-foreground/70" : "text-muted-foreground/60",
                        )}
                      >
                        {description}
                      </p>
                    </div>
                    {active && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute inset-y-2 left-0 w-1 rounded-full bg-primary-foreground"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Studio Status */}
               <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 rounded-xl border border-border bg-gradient-to-br from-card to-muted/50 p-3"
              >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Studio status
                </p>
                <Sparkles className="size-4 text-primary" />
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                  </span>
                  All systems operational
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="size-3 text-primary" />
                  Sales up 12.5% this week
                </div>
              </div>
            </motion.div>

            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200/70 bg-red-50/70 px-3.5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <LogOut className="size-4" />
              Sign out of Studio
            </motion.button>
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
  const { adminLogin, user, isAdmin } = useAuth();
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
      setError("Invalid administrator credentials. Redirecting to customer sign-in...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
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
                  defaultValue="admin@selah.store"
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
                  defaultValue="password"
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

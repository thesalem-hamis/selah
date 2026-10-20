import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  LogOut, 
  Package, 
  UserRound,
  Heart,
  Settings,
  ChevronRight,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) void navigate({ to: "/login", replace: true });
  }, [navigate, user]);
  
  if (!user) return null;
  return <ProfileDashboard />;
}

function ProfileDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const orders = useQuery({ 
    queryKey: ["account-orders", user?.email], 
    queryFn: () => orderService.byCustomer(user!.email), 
    enabled: Boolean(user) 
  });
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name });
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-white">
        <div className="container-page py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E5E5] pb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777] mb-4">
                My Account
              </p>
              <h1 className="text-4xl md:text-5xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}>
                Welcome, {user?.name.split(" ")[0]}
              </h1>
            </div>
            <button 
              onClick={logout}
              className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] hover:text-[#1A1A1A] transition-colors flex items-center gap-2"
            >
              Sign out <LogOut className="size-3" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-2">
              {[
                { id: 'orders', label: 'Order History' },
                { id: 'wishlist', label: 'Wishlist' },
                { id: 'settings', label: 'Account Details' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={cn(
                    "w-full flex items-center justify-between py-3 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors",
                    activeTab === item.id
                      ? "text-[#1A1A1A] border-b border-[#1A1A1A]"
                      : "text-[#777777] hover:text-[#1A1A1A] border-b border-transparent"
                  )}
                >
                  {item.label}
                  {activeTab === item.id && <ChevronRight className="size-3" strokeWidth={1.5} />}
                </button>
              ))}
              <Link to="/rewards" className="w-full flex items-center justify-between py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-[#777777] transition-colors hover:text-[#1A1A1A] border-b border-transparent">
                Rewards
                <ChevronRight className="size-3" strokeWidth={1.5} />
              </Link>
            </aside>

            {/* Main Content Area */}
            <section className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {orders.isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1A1A1A] border-r-transparent" />
                      </div>
                    ) : orders.data && orders.data.length > 0 ? (
                      <div className="space-y-6">
                        {orders.data.map((order, index) => (
                          <Link 
                            key={order.id}
                            to="/order/$id" 
                            params={{ id: order.id }} 
                            className="group block p-6 border border-[#E5E5E5] bg-white hover:border-[#1A1A1A] transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-1">
                                  Order {order.reference}
                                </p>
                                <p className="text-[13px] text-[#777777]">
                                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <span className="block text-[13px] text-[#1A1A1A]">{formatPrice(order.total)}</span>
                                  <span className="block text-[11px] uppercase tracking-[0.1em] text-[#777777] mt-1">
                                    {order.status.replaceAll("-", " ")}
                                  </span>
                                </div>
                                <ArrowRight className="size-4 text-[#777777] group-hover:text-[#1A1A1A] transition-colors" strokeWidth={1.5} />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-24 border border-[#E5E5E5] bg-[#f4f4f4]">
                        <ShoppingBag className="size-8 mx-auto text-[#BBBBBB] mb-6" strokeWidth={1} />
                        <h3 className="text-[14px] text-[#1A1A1A] mb-2">You haven't placed any orders yet.</h3>
                        <Link to="/shop" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] hover:text-[#1A1A1A] underline decoration-[#E5E5E5] underline-offset-4 transition-colors">
                          Return to Shop
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-24 border border-[#E5E5E5] bg-[#f4f4f4]"
                  >
                    <Heart className="size-8 mx-auto text-[#BBBBBB] mb-6" strokeWidth={1} />
                    <h3 className="text-[14px] text-[#1A1A1A] mb-2">Your wishlist is empty.</h3>
                    <Link to="/shop" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] hover:text-[#1A1A1A] underline decoration-[#E5E5E5] underline-offset-4 transition-colors">
                      Discover the Collection
                    </Link>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-xl space-y-12"
                  >
                    <div>
                      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-6 pb-2 border-b border-[#E5E5E5]">
                        Personal Information
                      </h2>
                      {editing ? (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">Full Name</label>
                            <input 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                              className="w-full h-12 px-4 border border-[#E5E5E5] bg-transparent text-[13px] focus:border-[#1A1A1A] outline-none transition-colors"
                            />
                          </div>
                          <div className="flex gap-4">
                            <button 
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                              className="h-12 bg-[#1A1A1A] text-white px-8 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors hover:bg-black/80 flex items-center justify-center min-w-[120px]"
                            >
                              {isSaving ? "SAVING..." : "SAVE"}
                            </button>
                            <button 
                              onClick={() => {
                                setEditing(false);
                                setName(user?.name ?? "");
                              }}
                              className="h-12 border border-[#E5E5E5] px-8 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 text-[13px] text-[#444444]">
                          <div className="flex justify-between items-center py-2">
                            <span>Name</span>
                            <span className="text-[#1A1A1A]">{user?.name}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span>Email</span>
                            <span className="text-[#1A1A1A]">{user?.email}</span>
                          </div>
                          <button 
                            onClick={() => setEditing(true)}
                            className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] hover:text-[#1A1A1A] underline decoration-[#E5E5E5] underline-offset-4 transition-colors"
                          >
                            EDIT PROFILE
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

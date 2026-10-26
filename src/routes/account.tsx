import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Gift,
  Heart,
  Loader2,
  LogOut,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChromeOrnament } from "@/components/store/ChromeOrnament";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import "@/styles/account.css";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Your account · Selah Girl Society" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && !user) void navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);
  if (!user) return null;
  return <ProfileDashboard />;
}

type AccountTab = "orders" | "wishlist" | "settings";
const tabs = [
  { id: "orders", label: "your orders", icon: Package },
  { id: "wishlist", label: "wishlist", icon: Heart },
  { id: "settings", label: "account details", icon: UserRound },
] as const;

function ProfileDashboard() {
  const { formatPrice } = useCurrency();
  const { user, logout, updateProfile } = useAuth();
  const { ids } = useWishlist();
  const [activeTab, setActiveTab] = useState<AccountTab>("orders");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; text: string } | null>(null);
  const orders = useQuery({
    queryKey: ["account-orders", user?.email],
    queryFn: () => orderService.byCustomer(user!.email),
    enabled: Boolean(user),
  });
  const products = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productService.list(),
    enabled: activeTab === "wishlist" && ids.length > 0,
  });
  const firstName = user?.name.trim().split(/\s+/)[0] || "girl";
  const saved = (products.data ?? []).filter((product) => ids.includes(product.id));

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    setFeedback(null);
    try {
      await updateProfile({ name: name.trim() });
      setEditing(false);
      setFeedback({ error: false, text: "Your details have been updated." });
    } catch (error) {
      setFeedback({
        error: true,
        text:
          error instanceof Error
            ? error.message
            : "We couldn't save your details. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StoreLayout>
      <div className="account-page">
        <div className="account-container">
          <header className="account-welcome">
            <div>
              <p className="account-eyebrow">your little corner of the society</p>
              <h1>hey, {firstName}.</h1>
              <p>Your favourite pieces, little moments, and everything Selah. All in one place.</p>
            </div>
            <ChromeOrnament variant="heart" className="account-welcome__heart" />
            <Link to="/shop" className="selah-button">
              find your next favourite <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </header>

          <div className="account-layout">
            <aside className="account-sidebar">
              <div className="account-member">
                <span className="account-avatar" aria-hidden="true">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong>{user?.name || "Selah girl"}</strong>
                  <span>Selah Girl Society</span>
                </div>
              </div>
              <nav className="account-nav" aria-label="Account sections">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-current={activeTab === id ? "page" : undefined}
                    onClick={() => setActiveTab(id)}
                    className={activeTab === id ? "is-active" : ""}
                  >
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span>{label}</span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </button>
                ))}
                <Link to="/rewards">
                  <Gift size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span>your rewards</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </nav>
              <button type="button" onClick={logout} className="account-signout">
                <LogOut size={16} aria-hidden="true" />
                sign out
              </button>
              <div className="account-help">
                <p>A little help?</p>
                <span>We’re here for you and your order.</span>
                <Link to="/support">
                  get in touch <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </aside>

            <section className="account-content" aria-labelledby="account-section-title">
              <header className="account-section-heading">
                <div>
                  <p className="account-eyebrow">
                    {activeTab === "orders"
                      ? "a little history"
                      : activeTab === "wishlist"
                        ? "love it. save it. wear it."
                        : "the essentials"}
                  </p>
                  <h2 id="account-section-title">
                    {tabs.find((tab) => tab.id === activeTab)?.label}
                  </h2>
                </div>
                {activeTab === "orders" && orders.isSuccess && (
                  <span className="account-count">
                    {orders.data.length} {orders.data.length === 1 ? "order" : "orders"}
                  </span>
                )}
                {activeTab === "wishlist" && (
                  <span className="account-count">{ids.length} saved</span>
                )}
              </header>

              {activeTab === "orders" &&
                (orders.isPending ? (
                  <div className="account-loading" role="status">
                    <Loader2 className="animate-spin" size={24} />
                    Loading your orders…
                  </div>
                ) : orders.isError ? (
                  <div className="account-empty" role="alert">
                    <h3>Your orders couldn’t load.</h3>
                    <p>Please try again in a moment.</p>
                    <button
                      type="button"
                      className="selah-button"
                      onClick={() => void orders.refetch()}
                    >
                      try again
                    </button>
                  </div>
                ) : orders.data.length ? (
                  <div className="account-orders">
                    {orders.data.map((order) => (
                      <Link
                        key={order.id}
                        to="/order/$id"
                        params={{ id: order.id }}
                        className="account-order"
                      >
                        <div className="account-order__top">
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="account-status">
                            {order.status.replaceAll("-", " ")}
                          </span>
                        </div>
                        <div className="account-order__body">
                          <div className="account-order__images">
                            {order.items.slice(0, 3).map((item, index) => (
                              <img
                                key={`${item.slug}-${index}`}
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                              />
                            ))}
                          </div>
                          <div className="account-order__detail">
                            <strong>
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces of
                              Selah
                            </strong>
                            <span className="account-reference">{order.reference}</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                          <ArrowUpRight
                            className="account-order__arrow"
                            size={20}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="account-order__bottom">
                          view order details <ChevronRight size={14} aria-hidden="true" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="account-empty">
                    <span className="account-empty__icon">
                      <ShoppingBag size={30} strokeWidth={1.3} aria-hidden="true" />
                    </span>
                    <h3>your story starts here.</h3>
                    <p>
                      No orders just yet. Find an everyday favourite with a little more meaning.
                    </p>
                    <Link to="/shop" className="selah-button">
                      explore the collection <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                ))}

              {activeTab === "wishlist" &&
                (ids.length === 0 ? (
                  <div className="account-empty">
                    <span className="account-empty__icon">
                      <Heart size={30} strokeWidth={1.3} aria-hidden="true" />
                    </span>
                    <h3>make room for your favourites.</h3>
                    <p>Your saved pieces live here, ready for whenever you are.</p>
                    <Link to="/shop" className="selah-button">
                      find something to love <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                ) : products.isError ? (
                  <div className="account-empty" role="alert">
                    <h3>Your wishlist couldn’t load.</h3>
                    <button
                      type="button"
                      className="selah-button"
                      onClick={() => void products.refetch()}
                    >
                      try again
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="account-section-note">
                      Saved on this device. A little inspiration for later.
                    </p>
                    <ProductGrid products={saved} loading={products.isPending} columns={3} />
                  </>
                ))}

              {activeTab === "settings" && (
                <div className="account-profile">
                  <p className="account-section-note">A few details that make this space yours.</p>
                  {editing ? (
                    <form onSubmit={handleSaveProfile}>
                      <label htmlFor="profile-name">full name</label>
                      <input
                        id="profile-name"
                        name="name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={isSaving}
                      />
                      <label htmlFor="profile-email">email address</label>
                      <input id="profile-email" type="email" value={user?.email ?? ""} readOnly />
                      <p className="account-section-note">Your email is linked to your sign-in.</p>
                      <div className="account-profile__actions">
                        <button className="selah-button" disabled={isSaving || !name.trim()}>
                          {isSaving ? "saving…" : "save details"}
                        </button>
                        <button
                          type="button"
                          className="account-text-action"
                          disabled={isSaving}
                          onClick={() => {
                            setEditing(false);
                            setName(user?.name ?? "");
                            setFeedback(null);
                          }}
                        >
                          cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <dl>
                        <div>
                          <dt>full name</dt>
                          <dd>{user?.name}</dd>
                        </div>
                        <div>
                          <dt>email address</dt>
                          <dd>{user?.email}</dd>
                        </div>
                      </dl>
                      <button
                        type="button"
                        className="selah-button"
                        onClick={() => {
                          setName(user?.name ?? "");
                          setEditing(true);
                          setFeedback(null);
                        }}
                      >
                        edit your details <UserRound size={16} aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {feedback && (
                    <p
                      className={feedback.error ? "account-feedback is-error" : "account-feedback"}
                      role={feedback.error ? "alert" : "status"}
                    >
                      {feedback.text}
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

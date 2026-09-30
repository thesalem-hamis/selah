import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  StoreLayout 
} from "@/components/store/StoreLayout";
import { OrderSummary } from "@/components/shared/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { customerService } from "@/services/customerService";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Shield, 
  Lock, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Building2,
  Globe,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
}

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  icon?: ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
}

function CheckoutPage() { 
  const cart = useCart(); 
  const { user } = useAuth(); 
  const navigate = useNavigate(); 
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    street: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card');

  useEffect(() => {
    if (!user) void navigate({ to: "/login", replace: true });
  }, [navigate, user]);

  const steps = [
    { number: 1, label: 'Contact', icon: User },
    { number: 2, label: 'Delivery', icon: MapPin },
    { number: 3, label: 'Payment', icon: CreditCard },
  ];

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData['name'].trim()) newErrors['name'] = 'Name is required';
      if (!formData['email'].trim()) newErrors['email'] = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData['email'])) newErrors['email'] = 'Invalid email address';
      if (!formData['phone'].trim()) newErrors['phone'] = 'Phone number is required';
    }
    
    if (step === 2) {
      if (!formData['street'].trim()) newErrors['street'] = 'Street address is required';
      if (!formData['city'].trim()) newErrors['city'] = 'City is required';
      if (!formData['state'].trim()) newErrors['state'] = 'State is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) return null;

  if (!cart.items.length) {
    return (
      <StoreLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-page py-24 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-muted"
          >
            <CreditCard className="size-10 text-muted-foreground" />
          </motion.div>
          <h1 className="font-display text-4xl">Your bag is empty</h1>
          <p className="mt-3 text-muted-foreground">Add some items to your bag before checking out.</p>
          <Button asChild className="mt-6 gap-2">
            <Link to="/shop">
              Shop the collection
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </StoreLayout>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep(3)) return;
    
    setBusy(true);
    try {
      const order = await orderService.create({
        customer: { 
          id: user.id,
          name: formData['name'], 
          email: formData['email'], 
          phone: formData['phone'] 
        },
        address: { 
          fullName: formData['name'], 
          phone: formData['phone'], 
          street: formData['street'], 
          city: formData['city'], 
          state: formData['state'], 
          country: "Nigeria" 
        },
        deliveryMethod: "Express (1–3 days)",
        paymentMethod: paymentMethod === 'card' ? "Paystack - Card" : 
                      paymentMethod === 'bank' ? "Bank Transfer" : "USSD",
        items: cart.items,
        subtotal: cart.subtotal,
        discount: cart.discount,
        shipping: cart.shipping,
        total: cart.total
      });
      
      await paymentService.initialise(cart.total, formData['email']);
      await customerService.recordOrder({
        id: user.id,
        name: formData['name'],
        email: formData['email'],
        phone: formData['phone'],
        total: cart.total,
      });
      cart.clear();
      await navigate({ to: "/order/$id", params: { id: order.id } });
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ submit: 'Failed to process order. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <StoreLayout>
      <div className="container-page py-10 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link 
            to="/cart" 
            className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to bag
          </Link>
          <p className="eyebrow text-primary flex items-center gap-2">
            <Sparkles className="size-4" />
            Almost yours
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Checkout</h1>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center font-semibold transition-all",
                      step > stepItem.number 
                        ? 'bg-primary text-primary-foreground'
                        : step === stepItem.number 
                          ? 'bg-primary/10 text-primary border-2 border-primary'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step > stepItem.number ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <stepItem.icon className="size-4" />
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-sm font-medium hidden sm:block",
                    step >= stepItem.number ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {stepItem.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: step > stepItem.number ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-y-0 left-0 bg-primary"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.section
                    key="contact"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-2xl flex items-center gap-2">
                      <User className="size-5 text-primary" />
                      Contact details
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field 
                        name="name" 
                        label="Full name" 
                        icon={User}
                        value={formData['name']}
                        onChange={(value) => updateField('name', value)}
                        error={errors['name']}
                      />
                      <Field 
                        name="email" 
                        label="Email address" 
                        type="email" 
                        icon={Mail}
                        value={formData['email']}
                        onChange={(value) => updateField('email', value)}
                        error={errors['email']}
                      />
                      <Field 
                        name="phone" 
                        label="Phone number" 
                        icon={Phone}
                        value={formData['phone']}
                        onChange={(value) => updateField('phone', value)}
                        error={errors['phone']}
                      />
                    </div>
                    <Button 
                      type="button"
                      onClick={handleNextStep}
                      className="mt-6 gap-2"
                    >
                      Continue to delivery
                      <ArrowRight className="size-4" />
                    </Button>
                  </motion.section>
                )}

                {step === 2 && (
                  <motion.section
                    key="delivery"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-2xl flex items-center gap-2">
                      <MapPin className="size-5 text-primary" />
                      Delivery address
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field 
                          name="street" 
                          label="Street address" 
                          icon={Home}
                          value={formData['street']}
                          onChange={(value) => updateField('street', value)}
                          error={errors['street']}
                        />
                      </div>
                      <Field 
                        name="city" 
                        label="City" 
                        icon={Building2}
                        value={formData['city']}
                        onChange={(value) => updateField('city', value)}
                        error={errors['city']}
                      />
                      <Field 
                        name="state" 
                        label="State" 
                        icon={Globe}
                        value={formData['state']}
                        onChange={(value) => updateField('state', value)}
                        error={errors['state']}
                      />
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="gap-2"
                      >
                        <ChevronLeft className="size-4" />
                        Back
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleNextStep}
                        className="gap-2"
                      >
                        Continue to payment
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </motion.section>
                )}

                {step === 3 && (
                  <motion.section
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-2xl flex items-center gap-2">
                      <CreditCard className="size-5 text-primary" />
                      Payment method
                    </h2>
                    
                    <div className="mt-4 space-y-3">
                      {[
                        { id: 'card', label: 'Card Payment', description: 'Pay with Visa, Mastercard, or Verve', icon: CreditCard },
                        { id: 'bank', label: 'Bank Transfer', description: 'Direct bank transfer payment', icon: Building2 },
                        { id: 'ussd', label: 'USSD', description: 'Pay using USSD code', icon: Phone },
                      ].map((method) => (
                        <motion.button
                          key={method.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                          className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                              : 'border-border hover:border-primary/30'
                          )}
                        >
                          <div className={cn(
                            "size-12 rounded-lg flex items-center justify-center",
                            paymentMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          )}>
                            <method.icon className="size-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{method.label}</p>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          <div className={cn(
                            "size-5 rounded-full border-2 flex items-center justify-center",
                            paymentMethod === method.id ? 'border-primary' : 'border-muted-foreground/30'
                          )}>
                            {paymentMethod === method.id && (
                              <div className="size-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="gap-2"
                      >
                        <ChevronLeft className="size-4" />
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        disabled={busy}
                        size="lg"
                        className="flex-1 gap-2"
                      >
                        {busy ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Processing…
                          </>
                        ) : (
                          <>
                            <Lock className="size-4" />
                            Pay {formatPrice(cart.total)}
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {errors['submit'] && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="size-4 shrink-0" />
                  {errors['submit']}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <OrderSummary 
                subtotal={cart.subtotal} 
                discount={cart.discount} 
                shipping={cart.shipping} 
                total={cart.total} 
              />

              {/* Trust badges */}
              <div className="mt-6 space-y-3">
                {[
                  { icon: Shield, text: 'Secure checkout' },
                  { icon: Truck, text: 'Express delivery available' },
                  { icon: Lock, text: '256-bit SSL encryption' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Icon className="size-4 text-primary shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </StoreLayout>
  );
}

function Field({ 
  name, 
  label, 
  type = "text", 
  icon: Icon,
  value,
  onChange,
  error
}: FieldProps) { 
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative mt-2">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        )}
        <input 
          name={name} 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required 
          className={cn(
            "h-11 w-full border bg-background px-3 rounded-lg transition-all",
            Icon && "pl-9",
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20',
            "focus:outline-none"
          )}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="size-3" />
          {error}
        </p>
      )}
    </label>
  ); 
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { OrderSummary } from "@/components/shared/OrderSummary";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { customerService } from "@/services/customerService";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Truck, 
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    { number: 1, label: 'CONTACT' },
    { number: 2, label: 'DELIVERY' },
    { number: 3, label: 'PAYMENT' },
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
        <div className="container-page py-32 text-center">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">
            Your Bag is Empty
          </p>
          <h1
            className="mb-8 text-4xl text-[#1A1A1A] md:text-5xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Add items to check out
          </h1>
          <Link
            to="/shop"
            className="inline-flex h-14 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
          >
            SHOP THE COLLECTION
          </Link>
        </div>
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
      <div className="container-page py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 flex flex-col items-center text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
            Almost Yours
          </p>
          <h1
            className="text-4xl text-[#1A1A1A] md:text-5xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            Checkout
          </h1>
        </header>

        {/* Progress Steps */}
        <div className="mb-16 flex items-center justify-center gap-8 border-b border-[#E5E5E5] pb-8">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center gap-4">
              <span 
                className={cn(
                  "text-[11px] font-bold uppercase tracking-[0.2em] transition-colors",
                  step >= stepItem.number ? "text-[#1A1A1A]" : "text-[#E5E5E5]"
                )}
              >
                {stepItem.number}. {stepItem.label}
              </span>
              {index < steps.length - 1 && (
                <span className="h-px w-8 bg-[#E5E5E5]" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-20">
            <div className="space-y-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.section
                    key="contact"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                      1. Contact Details
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field 
                        name="name" 
                        label="FULL NAME" 
                        value={formData['name']}
                        onChange={(value) => updateField('name', value)}
                        error={errors['name']}
                      />
                      <Field 
                        name="email" 
                        label="EMAIL ADDRESS" 
                        type="email" 
                        value={formData['email']}
                        onChange={(value) => updateField('email', value)}
                        error={errors['email']}
                      />
                      <Field 
                        name="phone" 
                        label="PHONE NUMBER" 
                        value={formData['phone']}
                        onChange={(value) => updateField('phone', value)}
                        error={errors['phone']}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={handleNextStep}
                      className="mt-10 flex h-14 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
                    >
                      CONTINUE TO DELIVERY
                    </button>
                  </motion.section>
                )}

                {step === 2 && (
                  <motion.section
                    key="delivery"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                      2. Delivery Address
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field 
                          name="street" 
                          label="STREET ADDRESS" 
                          value={formData['street']}
                          onChange={(value) => updateField('street', value)}
                          error={errors['street']}
                        />
                      </div>
                      <Field 
                        name="city" 
                        label="CITY" 
                        value={formData['city']}
                        onChange={(value) => updateField('city', value)}
                        error={errors['city']}
                      />
                      <Field 
                        name="state" 
                        label="STATE" 
                        value={formData['state']}
                        onChange={(value) => updateField('state', value)}
                        error={errors['state']}
                      />
                    </div>
                    <div className="mt-10 flex gap-4">
                      <button 
                        type="button"
                        onClick={handlePreviousStep}
                        className="flex h-14 w-1/3 items-center justify-center border border-[#1A1A1A] bg-white text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                      >
                        BACK
                      </button>
                      <button 
                        type="button"
                        onClick={handleNextStep}
                        className="flex h-14 flex-1 items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
                      >
                        CONTINUE TO PAYMENT
                      </button>
                    </div>
                  </motion.section>
                )}

                {step === 3 && (
                  <motion.section
                    key="payment"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                      3. Payment Method
                    </h2>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'card', label: 'CARD PAYMENT', description: 'Pay with Visa, Mastercard, or Verve' },
                        { id: 'bank', label: 'BANK TRANSFER', description: 'Direct bank transfer payment' },
                        { id: 'ussd', label: 'USSD', description: 'Pay using USSD code' },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                          className={cn(
                            "flex w-full items-center justify-between border p-6 text-left transition-colors",
                            paymentMethod === method.id
                              ? 'border-[#1A1A1A] bg-[#f4f4f4]'
                              : 'border-[#E5E5E5] bg-white hover:border-[#1A1A1A]'
                          )}
                        >
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">{method.label}</p>
                            <p className="mt-1 text-[12px] text-[#777777]">{method.description}</p>
                          </div>
                          <div className={cn(
                            "flex size-5 items-center justify-center border",
                            paymentMethod === method.id ? 'border-[#1A1A1A]' : 'border-[#E5E5E5]'
                          )}>
                            {paymentMethod === method.id && (
                              <div className="size-2.5 bg-[#1A1A1A]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-10 flex gap-4">
                      <button 
                        type="button"
                        onClick={handlePreviousStep}
                        className="flex h-14 w-1/3 items-center justify-center border border-[#1A1A1A] bg-white text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                      >
                        BACK
                      </button>
                      <button 
                        type="submit"
                        disabled={busy}
                        className="flex h-14 flex-1 items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                      >
                        {busy ? "PROCESSING..." : `PAY ${formatPrice(cart.total)}`}
                      </button>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {errors['submit'] && (
                <div className="mt-6 border border-red-500 bg-red-50 p-4 text-[12px] text-red-600">
                  {errors['submit']}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-32 h-fit">
              <OrderSummary 
                subtotal={cart.subtotal} 
                discount={cart.discount} 
                shipping={cart.shipping} 
                total={cart.total} 
              />

              {/* Trust badges */}
              <div className="mt-8 space-y-4">
                {[
                  { icon: Shield, text: 'Secure checkout' },
                  { icon: Truck, text: 'Express delivery available' },
                  { icon: Lock, text: '256-bit SSL encryption' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-[12px] text-[#777777]">
                    <Icon className="size-4 text-[#1A1A1A] shrink-0" strokeWidth={1.5} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
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
  value,
  onChange,
  error
}: FieldProps) { 
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
        {label}
      </label>
      <input 
        name={name} 
        type={type} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required 
        className={cn(
          "h-12 w-full border bg-transparent px-4 text-[13px] outline-none transition-colors",
          error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-[#E5E5E5] focus:border-[#1A1A1A]'
        )}
      />
      {error && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-red-500">
          <AlertCircle className="size-3" strokeWidth={1.5} />
          {error}
        </p>
      )}
    </div>
  ); 
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import "@/styles/login.css";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({ component: LoginPage });

type AuthMode = "login" | "register";
type RegisterStep = "form" | "verify";

function LoginPage() {
  const { user, login, startRegistration, verifyRegistrationOtp, resendRegistrationOtp, ready } =
    useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isEmailBusy, setIsEmailBusy] = useState(false);
  const [isGoogleBusy, setIsGoogleBusy] = useState(false);
  const busy = isEmailBusy || isGoogleBusy;
  const [registerStep, setRegisterStep] = useState<RegisterStep>("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (ready && user) {
      void navigate({ to: "/account", replace: true });
    }
  }, [ready, user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsGoogleBusy(true);
    setError("");
    try {
      const client = supabase;
      if (!client) throw new Error("Supabase is not configured");
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/login" },
      });
      if (error) throw new Error(error.message);
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (googleError) {
      setError(googleError instanceof Error ? googleError.message : "Google sign-in failed.");
      setIsGoogleBusy(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const next = [...otp];
    next[index] = value.replace(/\D/g, "").slice(0, 1);
    setOtp(next);
    if (value && index < 7) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8).split("");
    if (digits.length === 0) return;
    const next = ["", "", "", "", "", "", "", ""];
    digits.forEach((digit, i) => {
      next[i] = digit;
    });
    setOtp(next);
    const lastFilled = Math.min(digits.length, 7);
    otpRefs.current[lastFilled]?.focus();
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = otp.join("");
    if (code.length !== 8) {
      setError("Enter the 8-digit code from your email.");
      return;
    }
    setIsEmailBusy(true);
    setError("");
    try {
      await verifyRegistrationOtp(pendingEmail, code);
      await navigate({ to: "/account", replace: true });
    } catch (verifyError) {
      setError(
        verifyError instanceof Error ? verifyError.message : "That code didn't work. Try again.",
      );
    } finally {
      setIsEmailBusy(false);
    }
  };

  const handleResend = async () => {
    setIsEmailBusy(true);
    setError("");
    try {
      await resendRegistrationOtp(pendingEmail);
      setInfo("A new code is on its way to your inbox.");
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Couldn't resend the code.");
    } finally {
      setIsEmailBusy(false);
    }
  };

  if (ready && user) {
    return null;
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <section className="auth-editorial" aria-label="Selah Girl Society">
          <img
            className="auth-editorial__image"
            src="/selahmain.jpeg"
            alt="Selah Girl Society campaign"
          />
          <Link to="/" className="auth-brand">
            <img src="/selah-girls-logo.png" alt="Selah Girl Society home" />
          </Link>
          <div className="auth-editorial__copy">
            <span>made for the set-apart girl</span>
            <h1>
              your faith.
              <br />
              your style.
              <br />
              your society.
            </h1>
            <p>
              A little pause. A deeper purpose.
              <br />
              Wear what you believe.
            </p>
          </div>
          <span className="auth-editorial__footer">Faith & fashion, beautifully aligned.</span>
        </section>

        {/* Right Side - Auth Forms */}
        <section className="auth-form-panel">
          <Link
            to="/"
            className="absolute left-6 top-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] transition-colors hover:text-[#1A1A1A] lg:left-12 lg:top-12"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} /> BACK TO STORE
          </Link>

          <div className="auth-card">
            <div className="mb-6 flex text-center relative w-full items-center justify-center lg:hidden">
              <Link
                to="/"
                className="font-light tracking-[0.2em] text-2xl text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-selah)" }}
              >
                <img
                  src="/selah-girls-logo.png"
                  alt="Selah Girl Society"
                  className={cn("h-16 w-auto object-contain transition-opacity duration-300")}
                />
              </Link>
            </div>

            {mode === "register" && registerStep === "verify" ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2
                  className="text-3xl text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
                >
                  Check Your Inbox
                </h2>
                <p className="mt-4 text-[13px] leading-relaxed text-[#444444]">
                  We sent an 8-digit code to{" "}
                  <span className="font-medium text-[#1A1A1A]">{pendingEmail}</span>. Enter it below
                  to finish creating your account.
                </p>
                <form className="mt-8" onSubmit={handleVerifyOtp}>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[index] = element;
                        }}
                        value={digit}
                        onChange={(event) => handleOtpChange(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        onPaste={handleOtpPaste}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        required
                        aria-label={`Verification code digit ${index + 1}`}
                        className="auth-otp h-14 w-10 border border-[#E5E5E5] bg-transparent text-center text-xl outline-none transition-colors focus:border-[#1A1A1A]"
                      />
                    ))}
                  </div>
                  {error && (
                    <p role="alert" className="mt-4 text-[12px] text-red-600">
                      {error}
                    </p>
                  )}
                  {info && <p className="mt-4 text-[12px] text-emerald-600">{info}</p>}

                  <button
                    disabled={busy}
                    className="selah-button mt-8 flex h-14 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                  >
                    {isEmailBusy ? "VERIFYING..." : "VERIFY & ENTER ACCOUNT"}
                  </button>

                  <div className="mt-8 flex flex-col gap-4 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777]">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-1 hover:text-[#1A1A1A] disabled:opacity-50"
                    >
                      <RefreshCw className="size-3" strokeWidth={1.5} /> RESEND CODE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRegisterStep("form");
                        setOtp(["", "", "", "", "", "", "", ""]);
                        setError("");
                        setInfo("");
                      }}
                      className="hover:text-[#1A1A1A]"
                    >
                      USE A DIFFERENT EMAIL
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <>
                <div className="auth-tabs">
                  {(["login", "register"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setMode(item);
                        setError("");
                        setInfo("");
                      }}
                      className={cn(
                        "flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors relative",
                        mode === item ? "text-[#1A1A1A]" : "text-[#777777] hover:text-[#1A1A1A]",
                      )}
                    >
                      {item === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                      {mode === item && <span className="auth-tabs__indicator" />}
                    </button>
                  ))}
                </div>

                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2
                    className="text-3xl text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
                  >
                    {mode === "login" ? "welcome back, girl." : "a place in the society."}
                  </h2>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#444444]">
                    {mode === "login"
                      ? "Your orders, saved details, and Selah world are waiting."
                      : "Create your account and make space for what matters."}
                  </p>

                  <form
                    className="mt-8 space-y-5"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      setIsEmailBusy(true);
                      setError("");
                      setInfo("");
                      const data = new FormData(event.currentTarget);
                      try {
                        if (mode === "login") {
                          await login(String(data.get("email")), String(data.get("password")));
                          await navigate({ to: "/account", replace: true });
                        } else {
                          const email = String(data.get("email"));
                          const result = await startRegistration({
                            name: String(data.get("name")),
                            email,
                            phone: String(data.get("phone")),
                            password: String(data.get("password")),
                          });
                          setPendingEmail(result.email || email);
                          setRegisterStep("verify");
                        }
                      } catch (formError) {
                        setError(
                          formError instanceof Error
                            ? formError.message
                            : "We couldn't complete that request.",
                        );
                      } finally {
                        setIsEmailBusy(false);
                      }
                    }}
                  >
                    {mode === "register" && <AuthField name="name" label="FULL NAME" />}
                    {mode === "register" && (
                      <AuthField name="phone" label="PHONE NUMBER" type="tel" />
                    )}
                    <AuthField name="email" label="EMAIL ADDRESS" type="email" />
                    <AuthField name="password" label="PASSWORD" type="password" />

                    {mode === "login" && (
                      <div className="pt-2">
                        <button
                          type="button"
                          className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#777777] underline decoration-[#E5E5E5] underline-offset-4 hover:text-[#1A1A1A] transition-colors"
                        >
                          FORGOT PASSWORD?
                        </button>
                      </div>
                    )}

                    {error && (
                      <p role="alert" className="pt-2 text-[12px] text-red-600">
                        {error}
                      </p>
                    )}
                    {info && <p className="pt-2 text-[12px] text-emerald-600">{info}</p>}

                    <button
                      disabled={busy}
                      className="selah-button mt-8 flex h-14 w-full items-center justify-center bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                    >
                      {isEmailBusy
                        ? "PLEASE WAIT..."
                        : mode === "login"
                          ? "ENTER ACCOUNT"
                          : "CREATE ACCOUNT"}
                    </button>
                  </form>

                  <div className="my-10 flex items-center gap-4">
                    <span className="h-px flex-1 bg-[#E5E5E5]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">
                      OR
                    </span>
                    <span className="h-px flex-1 bg-[#E5E5E5]" />
                  </div>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={busy}
                    className="selah-button flex h-14 w-full items-center justify-center border border-[#1A1A1A] bg-transparent text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white disabled:opacity-50"
                  >
                    {isGoogleBusy ? "PLEASE WAIT..." : "CONTINUE WITH GOOGLE"}
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthField({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label
        htmlFor={`auth-${name}`}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={`auth-${name}`}
          autoComplete={
            name === "password"
              ? "current-password"
              : name === "name"
                ? "name"
                : name === "phone"
                  ? "tel"
                  : "email"
          }
          name={name}
          type={inputType}
          required
          className="h-12 w-full border border-[#E5E5E5] bg-transparent px-4 text-[13px] outline-none transition-colors focus:border-[#1A1A1A]"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#777777] hover:text-[#1A1A1A] transition-colors"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

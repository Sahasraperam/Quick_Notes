import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon, MailIcon, KeyRoundIcon, LockIcon } from "lucide-react";

// Step 1 → enter email → Step 2 → enter OTP → Step 3 → enter new password
const STEPS = {
  EMAIL: 1,
  OTP: 2,
  PASSWORD: 3,
};

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required.");

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "OTP sent to your email.");
      setStep(STEPS.OTP);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) return toast.error("Enter the 6-digit OTP.");

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      toast.success(res.data.message || "OTP verified!");
      setStep(STEPS.PASSWORD);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim())
      return toast.error("All fields are required.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { email, otp, password });
      toast.success(res.data.message || "Password updated successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step indicator ────────────────────────────────────────────────────────
  const steps = [
    { id: STEPS.EMAIL, label: "Email", icon: MailIcon },
    { id: STEPS.OTP, label: "OTP", icon: KeyRoundIcon },
    { id: STEPS.PASSWORD, label: "Password", icon: LockIcon },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2 justify-center">Forgot Password</h2>

              {/* Step indicator */}
              <ul className="steps steps-horizontal w-full mb-6">
                {steps.map(({ id, label }) => (
                  <li
                    key={id}
                    className={`step ${step >= id ? "step-primary" : ""}`}
                  >
                    {label}
                  </li>
                ))}
              </ul>

              {/* ── Step 1: Email ──────────────────────────────────────────── */}
              {step === STEPS.EMAIL && (
                <form onSubmit={handleSendOtp}>
                  <p className="text-sm text-base-content/70 mb-4 text-center">
                    Enter your account email and we'll send you a 6-digit OTP.
                  </p>
                  <div className="form-control mb-6">
                    <label className="label" htmlFor="fp-email">
                      <span className="label-text">Email address</span>
                    </label>
                    <input
                      id="fp-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="input input-bordered w-full"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {/* ── Step 2: OTP ────────────────────────────────────────────── */}
              {step === STEPS.OTP && (
                <form onSubmit={handleVerifyOtp}>
                  <p className="text-sm text-base-content/70 mb-4 text-center">
                    Check <strong>{email}</strong> for your 6-digit OTP.
                  </p>
                  <div className="form-control mb-2">
                    <label className="label" htmlFor="fp-otp">
                      <span className="label-text">6-digit OTP</span>
                    </label>
                    <input
                      id="fp-otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="e.g. 483291"
                      className="input input-bordered w-full tracking-widest text-center text-xl font-mono"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <div className="text-right mb-6">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => { setOtp(""); handleSendOtp({ preventDefault: () => {} }); }}
                    >
                      Resend OTP
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost flex-1"
                      onClick={() => setStep(STEPS.EMAIL)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Step 3: New Password ────────────────────────────────────── */}
              {step === STEPS.PASSWORD && (
                <form onSubmit={handleResetPassword} autoComplete="off">
                  <p className="text-sm text-base-content/70 mb-4 text-center">
                    Choose a strong new password.
                  </p>
                  <div className="form-control mb-4">
                    <label className="label" htmlFor="fp-password">
                      <span className="label-text">New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="fp-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="input input-bordered w-full pr-12"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute inset-y-0 right-3 flex items-center text-base-content/50 hover:text-base-content transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="form-control mb-6">
                    <label className="label" htmlFor="fp-confirm">
                      <span className="label-text">Confirm New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="fp-confirm"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="input input-bordered w-full pr-12"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        className="absolute inset-y-0 right-3 flex items-center text-base-content/50 hover:text-base-content transition-colors"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="link link-primary">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

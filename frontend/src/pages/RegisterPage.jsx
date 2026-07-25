import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", { username, email, password });
      toast.success("Registered successfully!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/home");
    } catch (error) {
      console.log("Error registering", error);
      toast.error(error.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4 justify-center">Create an Account</h2>
              {/* autocomplete="on" + name/id + new-password tells Chrome this is a signup form */}
              <form onSubmit={handleSubmit} autoComplete="on">
                <div className="form-control mb-4">
                  <label className="label" htmlFor="register-username">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    id="register-username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    className="input input-bordered w-full"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label" htmlFor="register-email">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-control mb-6">
                  <label className="label" htmlFor="register-password">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="input input-bordered w-full pr-12"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-base-content/50 hover:text-base-content transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="size-5" />
                      ) : (
                        <EyeIcon className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm">
                  Already have an account?{" "}
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

export default RegisterPage;

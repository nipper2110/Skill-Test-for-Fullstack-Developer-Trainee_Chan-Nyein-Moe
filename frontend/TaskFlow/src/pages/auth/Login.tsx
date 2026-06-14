import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  EyeOpenIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6fa] px-4">
      <Card className="w-full max-w-115 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <CardHeader className="mb-4 space-y-1 p-0 text-left">
          <CardTitle className="text-[22px] font-bold tracking-tight text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your credentials to access your workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-3">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Field className="space-y-1">
                <FieldLabel
                  htmlFor="email"
                  className="text-sm font-bold text-gray-700"
                >
                  Email Address
                </FieldLabel>
                <div className="relative flex items-center">
                  <EnvelopeClosedIcon className="absolute left-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 pl-11"
                  />
                </div>
              </Field>

              <Field className="space-y-1">
                <FieldLabel
                  htmlFor="password"
                  className="text-sm font-bold text-gray-700"
                >
                  Password
                </FieldLabel>
                <div className="relative flex items-center">
                  <LockClosedIcon className="absolute left-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 pr-11 pl-11 tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600"
                  >
                    <EyeOpenIcon className="h-4 w-4" />
                  </button>
                </div>
              </Field>

              <div className="flex justify-between">
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-sm font-medium text-gray-600"
                  >
                    Remember this device
                  </label>
                </div>
                <Link
                  to="/forgotPassword"
                  className="text-sm font-semibold text-[#1d4ed8] hover:text-[#1e40af]"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-[#1d4ed8] font-semibold hover:bg-[#1e40af]"
                >
                  <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#0b3c95] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;

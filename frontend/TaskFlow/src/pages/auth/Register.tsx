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
  PersonIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

function Register() {
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms of Service");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ fullName, email, password, confirmPassword });
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6fa] px-4 py-8">
      <Card className="w-full max-w-115 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <CardHeader className="mb-4 space-y-1 p-0 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Create Workspace
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Start managing your team effectively today.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-1">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Field className="space-y-1">
                <FieldLabel
                  htmlFor="fullName"
                  className="text-xs font-bold text-gray-700"
                >
                  Full Name
                </FieldLabel>
                <div className="relative flex items-center">
                  <PersonIcon className="absolute left-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 pl-11"
                  />
                </div>
              </Field>

              <Field className="space-y-1">
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-bold text-gray-700"
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field className="space-y-1">
                  <FieldLabel
                    htmlFor="password"
                    className="text-xs font-bold text-gray-700"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <LockClosedIcon className="absolute left-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 pl-11"
                    />
                  </div>
                </Field>

                <Field className="space-y-1">
                  <FieldLabel
                    htmlFor="confirmPassword"
                    className="text-xs font-bold text-gray-700"
                  >
                    Confirm Password
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <LockClosedIcon className="absolute left-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 pl-11"
                    />
                  </div>
                </Field>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-tight text-gray-600"
                >
                  I agree to the{" "}
                  <Link
                    to="#"
                    className="font-semibold text-[#1d4ed8] hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="#"
                    className="font-semibold text-[#1d4ed8] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-[#2563eb] font-semibold hover:bg-[#1d4ed8]"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#0b3c95] hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Register;

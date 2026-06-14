import { useState } from "react";
import { Link } from "react-router";
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
import { EnvelopeClosedIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { api } from "@/lib/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await api.auth.forgotPassword(email);
      setMessage(result.message);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6fa] px-4">
      <Card className="w-full max-w-115 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <CardHeader className="mb-6 space-y-1 p-0 text-left">
          <CardTitle className="text-[26px] font-bold tracking-tight text-gray-900">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-gray-500">
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-1">
              {message && (
                <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  {message}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border-gray-200 bg-white pr-4 pl-11 text-gray-900 placeholder-gray-400 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-blue-700"
                  />
                </div>
              </Field>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-[#2563eb] text-base text-white shadow-sm transition-colors hover:bg-[#1d4ed8]"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

              <hr className="my-2 border-gray-100/80" />

              <div className="flex items-center justify-center">
                <Link
                  to="/login"
                  className="flex items-center gap-2 py-1 text-sm font-bold text-gray-600 transition-colors hover:text-gray-900 focus-visible:underline focus-visible:outline-none"
                >
                  <ArrowLeftIcon className="h-4 w-4 stroke-2" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;

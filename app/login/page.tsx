import { loginAction } from "@/app/lib/auth-actions";
import { FormField } from "@/app/components/atoms/form-field";
import { Button } from "@/app/components/atoms/button";
import { LogIn } from "lucide-react";
import Image from "next/image";

/**
 * Login page component.
 * Provides a form for the user to enter their password and authenticate.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-sky-500/10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="relative w-20 h-20 bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] flex items-center justify-center border border-gray-100">
              <Image
                src="/favicon.ico"
                alt="Site Icon"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Welcome back to atsulog
          </p>
        </div>

        <form action={loginAction} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <FormField
              id="password"
              type="password"
              defaultValue=""
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-sm text-red-600 text-center font-medium">
                Invalid password. Please try again.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              icon={LogIn}
              className="w-full py-3"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

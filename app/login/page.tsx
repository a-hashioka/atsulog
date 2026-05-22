import { loginAction } from "@/app/lib/auth-actions";
import { FormField } from "@/app/components/atoms/form-field";

/**
 * Login page component.
 * Provides a form for the user to enter their password and authenticate.
 * @param props - Component props including search parameters.
 * @returns The rendered login page.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Admin Login</h1>

      <form action={loginAction}>
        <FormField id="password" type="password" defaultValue="" />

        {error && (
          <p style={{ color: "red" }}>Invalid password. Please try again.</p>
        )}

        <button type="submit">Login</button>
      </form>
    </main>
  );
}

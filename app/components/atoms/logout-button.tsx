import { logoutAction } from "@/app/lib/auth-actions";

/**
 * A reusable logout button component.
 * Uses a server action to handle the logout process.
 * @returns The logout button element.
 */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit">Logout</button>
    </form>
  );
}

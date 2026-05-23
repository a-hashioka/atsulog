import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/lib/auth-actions";
import { Button } from "./button";

/**
 * A reusable logout button component.
 * Uses a server action to handle the logout process.
 * @returns The logout button element.
 */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" icon={LogOut}>
        Logout
      </Button>
    </form>
  );
}

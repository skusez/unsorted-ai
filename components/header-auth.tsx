"use server";

import { createClient } from "@/utils/supabase/server";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

export const AuthButton = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
};

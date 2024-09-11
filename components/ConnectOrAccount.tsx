"use client";

import { useSession } from "@/lib/useSession";
import UserMenu from "./UserMenu";
import { Button } from "./ui/button";

export default function ConnectOrAccount() {
  const { data: session, isLoading } = useSession();
  // Wrapper component to ensure consistent width and right alignment
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-[120px] flex items-center justify-end">
      {" "}
      {/* Added ml-auto for right alignment */}
      {children}
    </div>
  );

  console.log({ session });
  if (isLoading)
    return (
      <Wrapper>
        <Button size={"sm"} className="w-full" disabled>
          Loading...
        </Button>
      </Wrapper>
    );

  if (session?.id) {
    return (
      <Wrapper>
        <UserMenu
          isExpanded
          className="flex-row-reverse w-full text-sm gap-2 bg-primary h-9"
          addressClassName="text-sm truncate"
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <w3m-connect-button size="sm" />
    </Wrapper>
  );
}

"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "./Breadcrumbs";
import { SidebarContent } from "./sidebar/sidebar-content";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export function Header({
  setSearch = () => {},
}: {
  setSearch?: (value: string) => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  return (
    <header className=" py-4 z-30 flex h-14 items-center gap-4   sm:static sm:h-auto sm:border-0 sm:bg-transparent ">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-8 sm:max-w-xs">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>
      <Breadcrumbs />
      <div className="relative ml-auto flex-1 md:grow-0">
        <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
    </header>
  );
}

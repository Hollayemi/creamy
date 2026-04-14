"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

function getSearchableItems() {
  const items: {
    group: string;
    icon?: any;
    label: string;
    url?: string;
  }[] = [];

  sidebarItems.forEach((group) => {
    group.items.forEach((item) => {
      // main item
      items.push({
        group: item.title || "General",
        icon: item.icon,
        label: item.title,
        url: item.url,
      });

      // subItems if exist
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          items.push({
            group: item.title,
            icon: item.icon,
            label: sub.title,
            url: sub.url,
          });
        });
      }
    });
  });

  return items;
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const searchItems = React.useMemo(() => getSearchableItems(), []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url?: string) => {
    if (url) window.location.href = url; // 👈 navigate when selected
    setOpen(false);
  };

  const groups = Array.from(new Set(searchItems.map((i) => i.group)));

  return (
    <>
      <Button
        variant="link"
        className="text-muted-foreground !px-0 font-normal hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Search
        <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, modules, and more…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groups.map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem key={item.label} className="!py-1.5" onSelect={() => handleSelect(item.url)}>
                      {item.icon && <item.icon className="mr-2 size-4" />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

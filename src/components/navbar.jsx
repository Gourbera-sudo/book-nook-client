"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@base-ui/react/avatar";
import { Menu } from "@base-ui/react/menu";
import {
  BookOpen,
  ChevronDown,
  LogOut,
  Menu as MenuIcon,
  User,
  X,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const PRIVATE_LINKS = [
  { href: "/books/add", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/books") {
    return (
      pathname === "/books" ||
      (pathname.startsWith("/books/") && !pathname.startsWith("/books/add"))
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getUserName(user) {
  return (
    user?.name || user?.displayName || user?.email?.split("@")[0] || "Reader"
  );
}

function getUserImage(user) {
  return user?.image || user?.photoURL || user?.avatarUrl || "";
}

function getInitials(name) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "U";
}

function NavLinks({ user, pathname, onNavigate, className }) {
  const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

  return (
    <nav
      aria-label="Main navigation"
      className={cn("items-center gap-1", className)}
    >
      {links.map((link) => {
        const active = isActive(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-md font-medium transition-colors",
              active
                ? "bg-sky-200 text-sky-900"
                : "text-sky-900/70 hover:bg-sky-100 hover:text-sky-950",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AuthButtons({ className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "text-sky-600 hover:bg-sky-100 hover:text-sky-900",
        )}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ size: "lg" }),
          "bg-sky-600 text-white hover:bg-sky-700",
        )}
      >
        Register
      </Link>
    </div>
  );
}

const menuItemClass =
  "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-sky-100 data-highlighted:text-sky-900";

function UserMenu({ user, onLogout, align = "end" }) {
  const name = getUserName(user);
  const image = getUserImage(user);

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open user menu"
        className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
      >
        <Avatar.Root className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sm font-medium text-sky-700 select-none">
          {image ? (
            <Avatar.Image
              src={image}
              alt={name}
              width={32}
              height={32}
              className="size-full object-cover"
            />
          ) : null}
          <Avatar.Fallback
            delay={image ? 300 : 0}
            className="flex size-full items-center justify-center"
          >
            {getInitials(name)}
          </Avatar.Fallback>
        </Avatar.Root>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-sky-700"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align={align} className="z-50">
          <Menu.Popup className="min-w-56 origin-[var(--transform-origin)] rounded-lg border border-sky-200 bg-white p-1 text-sky-950 shadow-md outline-hidden transition-[transform,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="px-2 py-2">
              <p className="truncate text-sm font-medium">{name}</p>
              {user?.email ? (
                <p className="truncate text-xs text-sky-800/70">
                  {user.email}
                </p>
              ) : null}
            </div>

            <Menu.Separator className="my-1 h-px bg-sky-200" />

            <Menu.LinkItem
              render={<Link href="/profile" />}
              closeOnClick
              className={menuItemClass}
            >
              <User aria-hidden="true" className="size-4" />
              My Profile
            </Menu.LinkItem>

            <Menu.Separator className="my-1 h-px bg-sky-200" />

            <Menu.Item
              onClick={onLogout}
              className={cn(
                menuItemClass,
                "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive",
              )}
            >
              <LogOut aria-hidden="true" className="size-4 text-2xl" />
              Logout
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export default function Navbar({ onLogout }) {
  const {data: session} = authClient.useSession();
  const user = session?.user;
  console.log(user)
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = Boolean(user);

  function closeMobileMenu() {
    setMobileOpen(false);
  }
  

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200 bg-sky-50/80 backdrop-blur supports-[backdrop-filter]:bg-sky-50/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-sky-600 text-white">
            <BookOpen aria-hidden="true" className="size-5" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-sky-950">
            BookNook
          </span>
        </Link>

        <NavLinks
          user={isLoggedIn ? user : null}
          pathname={pathname}
          className="hidden md:flex"
        />

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <UserMenu user={user} onLogout={onLogout} />
          ) : (
            <AuthButtons />
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-9 items-center justify-center rounded-md text-sky-800 transition-colors hover:bg-sky-100 hover:text-sky-950 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none md:hidden"
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <MenuIcon aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div id="mobile-navigation" className="border-t border-sky-200 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
            <NavLinks
              user={isLoggedIn ? user : null}
              pathname={pathname}
              onNavigate={closeMobileMenu}
              className="flex flex-col items-stretch"
            />

            <div className="border-t border-sky-200 pt-3">
              {isLoggedIn ? (
                <div className="flex justify-end">
                  <UserMenu user={user} onLogout={onLogout} />
                </div>
              ) : (
                <AuthButtons className="justify-end" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

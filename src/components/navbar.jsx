"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { clearAuthToken } from "@/lib/api-client";
import ThemeToggle from "@/components/theme-toggle";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/all-books", label: "All Books" },
];

const PRIVATE_LINKS = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/all-books") {
    return (
      pathname === "/all-books" ||
      (pathname.startsWith("/all-books/") &&
        !pathname.startsWith("/all-books/add")) ||
      pathname.startsWith("/books/")
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
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
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
          "text-primary hover:bg-accent hover:text-foreground",
        )}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ size: "lg" }),
          "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        Register
      </Link>
    </div>
  );
}

const menuItemClass =
  "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-foreground";

function UserMenu({ user, onLogout, align = "end" }) {
  const name = getUserName(user);
  const image = getUserImage(user);

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open user menu"
        className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Avatar.Root className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-accent text-sm font-medium text-accent-foreground select-none">
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
          className="size-4 text-primary"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align={align} className="z-50">
          <Menu.Popup className="min-w-56 origin-[var(--transform-origin)] rounded-lg border border-border bg-card p-1 text-foreground shadow-md outline-hidden transition-[transform,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="px-2 py-2">
              <p className="truncate text-sm font-medium">{name}</p>
              {user?.email ? (
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              ) : null}
            </div>

            <Menu.Separator className="my-1 h-px bg-accent" />

            <Menu.LinkItem
              render={<Link href="/profile" />}
              closeOnClick
              className={menuItemClass}
            >
              <User aria-hidden="true" className="size-4" />
              My Profile
            </Menu.LinkItem>

            <Menu.Separator className="my-1 h-px bg-accent" />

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
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = Boolean(user);

  function closeMobileMenu() {
    setMobileOpen(false);
  }
  
  const handleLogout = async() => {
    await authClient.signOut();
    clearAuthToken();
    if (onLogout) {
      onLogout();
    }
    router.push("/login");
  }
  
  

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen aria-hidden="true" className="size-5" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            BookNook
          </span>
        </Link>

        <NavLinks
          user={isLoggedIn ? user : null}
          pathname={pathname}
          className="hidden md:flex"
        />

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isLoggedIn ? (
            <UserMenu user={user} onLogout={handleLogout} />
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
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:hidden"
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <MenuIcon aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div id="mobile-navigation" className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
            <NavLinks
              user={isLoggedIn ? user : null}
              pathname={pathname}
              onNavigate={closeMobileMenu}
              className="flex flex-col items-stretch"
            />

            <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
              <ThemeToggle />
              {isLoggedIn ? (
                <div className="flex justify-end">
                  <UserMenu user={user} onLogout={handleLogout} />
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

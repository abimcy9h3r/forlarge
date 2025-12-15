"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DollarSign,
  Monitor,
  ShoppingCart,
  Tag,
  BarChart3,
  Users,
  ChevronDown,
  ChevronsRight,
  Settings,
  HelpCircle,
  Upload,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function DashboardSidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="font-light text-lg">forlarge</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4">
                <TitleSection open={true} />
                <div className="space-y-1 mt-8">
                  <Option
                    Icon={Home}
                    title="Dashboard"
                    href="/dashboard"
                    pathname={pathname}
                    open={true}
                  />
                  <Option
                    Icon={ShoppingCart}
                    title="Products"
                    href="/dashboard/products"
                    pathname={pathname}
                    open={true}
                  />
                  <Option
                    Icon={Upload}
                    title="New Product"
                    href="/dashboard/products/new"
                    pathname={pathname}
                    open={true}
                  />
                  <Option
                    Icon={BarChart3}
                    title="Analytics"
                    href="/dashboard/analytics"
                    pathname={pathname}
                    open={true}
                  />
                  <Option
                    Icon={DollarSign}
                    title="Sales"
                    href="/dashboard/sales"
                    pathname={pathname}
                    open={true}
                  />
                  <Option
                    Icon={Settings}
                    title="Settings"
                    href="/dashboard/settings"
                    pathname={pathname}
                    open={true}
                  />
                  <Option
                    Icon={HelpCircle}
                    title="Help"
                    href="/dashboard/help"
                    pathname={pathname}
                    open={true}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav
        className={`hidden lg:block sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
          open ? 'w-64' : 'w-16'
        } border-border bg-background p-2 shadow-sm`}
      >
        <TitleSection open={open} />

      <div className="space-y-1 mb-8">
        <Option
          Icon={Home}
          title="Dashboard"
          href="/dashboard"
          pathname={pathname}
          open={open}
        />
        <Option
          Icon={ShoppingCart}
          title="Products"
          href="/dashboard/products"
          pathname={pathname}
          open={open}
        />
        <Option
          Icon={Upload}
          title="New Product"
          href="/dashboard/products/new"
          pathname={pathname}
          open={open}
        />
        <Option
          Icon={DollarSign}
          title="Sales"
          href="/dashboard/sales"
          pathname={pathname}
          open={open}
        />
        <Option
          Icon={BarChart3}
          title="Analytics"
          href="/dashboard/analytics"
          pathname={pathname}
          open={open}
        />
        <Option
          Icon={Monitor}
          title="View Site"
          href="/"
          pathname={pathname}
          open={open}
        />
      </div>

      {open && (
        <div className="border-t border-border pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Account
          </div>
          <Option
            Icon={Settings}
            title="Settings"
            href="/dashboard/settings"
            pathname={pathname}
            open={open}
          />
          <Option
            Icon={HelpCircle}
            title="Help & Support"
            href="/dashboard/help"
            pathname={pathname}
            open={open}
          />
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
      </nav>
    </>
  );
}


function Option({ Icon, title, href, pathname, open }: any) {
  const isSelected = pathname === href;
  
  return (
    <Link
      href={href}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-sky-500/10 text-sky-500 shadow-sm border-l-2 border-sky-500" 
          : "text-foreground/60 hover:bg-accent hover:text-foreground"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}
    </Link>
  );
}

function TitleSection({ open }: any) {
  return (
    <div className="mb-6 border-b border-border pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-accent">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold">
                    forlarge
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Creator Dashboard
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-sm">
      <svg
        width="20"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        />
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        />
      </svg>
    </div>
  );
}

function ToggleClose({ open, setOpen }: any) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-border transition-colors hover:bg-accent"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-muted-foreground ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-foreground/60 transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Hide
          </span>
        )}
      </div>
    </button>
  );
}

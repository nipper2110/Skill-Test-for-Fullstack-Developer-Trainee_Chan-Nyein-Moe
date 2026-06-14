import { Link } from "react-router";

import { Icons } from "../icons";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function MobileNavigation() {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-4 size-5">
            <Icons.menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pt-0 pr-0 pl-1">
          <SheetHeader>
            <SheetTitle>
              <div className="flex flex-col">
                <span className="font-bold text-[#002584]">TaskFlow Pro</span>
                <span className="text-sm text-[#5C5F61]">Workspace</span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <SheetClose asChild>
            <Link to="/" className="ml-4 flex items-center">
              <Icons.dashboard className="mr-2 size-4" />
              <span>Dashboard</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link to="/tasks" className="ml-4 flex items-center">
              <Icons.tasks className="mr-2 size-4" />
              <span>Tasks</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link to="/categories" className="ml-4 flex items-center">
              <Icons.categories className="mr-2 size-4" />
              <span>Categories</span>
            </Link>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavigation;

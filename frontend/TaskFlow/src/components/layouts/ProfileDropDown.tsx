import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "../icons";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

function ProfileDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white transition-transform duration-200 select-none hover:scale-105 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none active:scale-95 ${user?.avatarUrl ? "" : (user?.avatarColor ?? "bg-[#9da8b6]")}`}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              (user?.initials ?? "U")
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="animate-in fade-in-50 slide-in-from-top-1 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
          <div className="market px-2 py-1.5 text-left">
            <p className="text-sm font-semibold text-gray-900">
              {user?.fullName ?? "User"}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email ?? ""}</p>
          </div>

          <DropdownMenuSeparator className="my-1 bg-gray-100" />

          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Icons.profile className="h-4 w-4 text-gray-500" />
            <Link to="/profile">
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-gray-100" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Icons.logout />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProfileDropDown;

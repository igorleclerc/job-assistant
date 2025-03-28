"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/use-user-store";

export const UserDropdown = () => {
  const { user, setUser, signOut } = useUserStore();
  
  if (!user) {
    return (
      <Link href="/login">
        <button className="rounded-md border p-2 hover:bg-gray-100 active:bg-gray-200">
          Connexion
        </button>
      </Link>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hover:bg-gray-100 active:bg-gray-200 border p-2 justify-between flex items-center rounded-md gap-2 cursor-pointer">
          <div className="">
            <p className="text-sm font-medium">{user.displayName || user.email}</p>
          </div>
          <Avatar>
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
          onClick={signOut}
          variant="destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

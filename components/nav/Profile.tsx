import React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PersonIcon, AvatarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import Logout from "./Logout";


export default function Profile({ user }: { user: User | undefined }) {
	return (
		<Popover>
			<PopoverTrigger>
                <AvatarIcon className="h-12 w-12"/>
			</PopoverTrigger>
			<PopoverContent className="space-y-3 divide-y p-2" side="bottom">
				<div className="px-4">
					<p className="text-sm">{user?.user_metadata.display_name}</p>
					<p className="text-sm text-gray-500">{user?.email}</p>
				</div>

				<Link href="/profile">
						<Button
							variant="ghost"
							className="w-full flex justify-between items-center"
						>
							Perfil <PersonIcon />
						</Button>
					</Link>
				<Logout />
			</PopoverContent>
		</Popover>
	);
}
"use client";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { useUser } from "@/lib/hook";
import Profile from "./Profile";
import { ModeToggle } from "../ui/theme-button";

export function Navbar() {
    return (
        <nav className="w-full justify-between items- flex p-5">
            <Link href="/">Horario</Link>
            <div className="ml-auto flex space-x-3">
                <RenderProfile />
                <ModeToggle/>
            </div>
        </nav>
    );
}

const RenderProfile = () => {
	const { data, isFetching } = useUser();

	if (isFetching) {
		return <></>;
	}

	if (data?.user?.id) {
		return (
            <div className="flex items-center space-x-4"> {/* Added this line */}
                <Profile user={data?.user} />
            </div>
        );
	} else {
		return <LoginForm />;
	}
};
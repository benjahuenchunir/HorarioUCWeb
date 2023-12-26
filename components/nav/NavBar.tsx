"use client";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { useUser } from "@/lib/hook";
import Profile from "./Profile";

export function Navbar() {
    return (
        <nav className="w-full justify-between items-center flex p-5 xl:p-0">
            <div className="space-x-4 flex">
                <Link href="/">Horario</Link>
            </div>
            <RenderProfile />
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
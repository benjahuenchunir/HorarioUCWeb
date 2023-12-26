"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginForm() {
	const router = useRouter();
	return (
		<Button
			className="flex items-center gap-2"
			variant="outline"
			onClick={() => router.push("/auth")}
		>
			Login
		</Button>
	);
}

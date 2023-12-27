"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import createSupabaseBrowerClient from "@/lib/supabase/client";

const FormSchema = z
	.object({
		email: z.string().min(1, { message: "El email es requerido." }),
		password: z.string().min(1, {
			message: "La contraseña es requerida.",
		}),
		confirm: z.string().min(1, {
			message: "La contraseña es requerida.",
		}),
	})
	.refine((data) => data.confirm === data.password, {
		message: "Las contraseñas no coinciden.",
		path: ["confirm"],
	});
export default function RegisterForm() {
	const supabase = createSupabaseBrowerClient();
	let [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirm: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		startTransition(async () => {
			const result = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					emailRedirectTo: `${location.origin}/auth/confirm`
				}
			});
			const { error } = result;
			if (error?.message) {
				toast({
					variant: "destructive",
					title: "You submitted the following values:",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
							<code className="text-white">{error.message}</code>
						</pre>
					),
				});
			} else {
				toast({
					title: "Registro exitoso, revisa tu correo.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
							<code className="text-white">
								register complete
							</code>
						</pre>
					),
				});
			}
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-6"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="ejemplo@gmail.com"
									{...field}
									type="email"
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contraseña</FormLabel>
							<FormControl>
								<Input
									placeholder="Contraseña"
									{...field}
									type="password"
									onChange={field.onChange}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirm"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmar contraseña</FormLabel>
							<FormControl>
								<Input
									placeholder="Confirmar contraseña"
									{...field}
									type="password"
									onChange={field.onChange}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full flex gap-2">
					Registrarse{" "}
					<AiOutlineLoading3Quarters
						className={cn(" animate-spin", { hidden: !isPending })}
					/>
				</Button>
			</form>
		</Form>
	);
}

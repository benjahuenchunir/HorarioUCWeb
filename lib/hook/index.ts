import createSupabaseBrowerClient from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
	const supabase = createSupabaseBrowerClient();
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const { data } = await supabase.auth.getSession();
			return { user: data.session?.user };
		},
		staleTime: Infinity,
	});
}
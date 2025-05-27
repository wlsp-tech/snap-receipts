import {FormProvider, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"
import {Button} from "@/components/ui/button.tsx"
import {FormField, FormItem, FormMessage} from "@/components/ui/form.tsx"
import {cn} from "@/lib/utils.ts"
import {ComponentProps} from "react"
import {fetchCurrentUser, loginUser} from "@/features/auth";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

const loginSchema = z.object({
    email: z.string().email({message: "Please enter a valid e-mail."}),
    password: z.string().min(4, {message: "Password cannot be empty."}),
})

export function LoginForm({className, ...props}: ComponentProps<"form">) {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { reset, formState: { isSubmitting} } = form

    const onSubmit = async (data: z.infer<typeof loginSchema>)=> {
        try {
            const result = await loginUser(data);
            if(result.success) {
                toast.success(`Welcome ${result.data.nameOfUser}!`);
                reset();

                const currentUser = await fetchCurrentUser();
                console.log("Current user:", currentUser);
            }
            console.log(result)
        } catch (err) {
            if (err instanceof Error) {
                console.log((err))
                toast.error(`Login failed: ${err.message}`);
            } else {
                toast.error("Unknown error while login");
            }
        }

    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-6", className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...field}
                                id="email"
                                placeholder="j@example.com"
                                type="email"
                                disabled={isSubmitting}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                {...field}
                                id="password"
                                type="password"
                                disabled={isSubmitting}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </FormProvider>
    )
}

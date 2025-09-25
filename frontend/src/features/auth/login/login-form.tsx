import {FormProvider, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Input} from "@/components/ui/common/input.tsx"
import {Label} from "@/components/ui/common/label.tsx"
import {Button} from "@/components/ui/common/button.tsx"
import {FormField, FormItem, FormMessage} from "@/components/ui/common/form.tsx"
import {cn} from "@/lib/utils.ts"
import {ComponentProps} from "react"
import {toast} from "sonner";
import {Loader2} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";
import {useAuth} from "@/features/auth/hooks";

const loginSchema = z.object({
    email: z.string().email({message: "Please enter a valid e-mail."}),
    password: z.string().min(4, {message: "Password cannot be this short budy."}),
})

export function LoginForm({...props}: ComponentProps<"form">) {
    const { login } = useAuth();
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { reset, formState: { isSubmitting, errors } } = form

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            await login(values.email, values.password)
            await navigate({ to: '/dashboard' })
            reset()
        } catch (err) {
            if (err instanceof Error) {
                form.setError("root", { message: "Try again budy..." })
                toast.error("Login failed!");
            } else {
                toast.error("Unknown error during login.");
            }
        }
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 p-2 border border-transparent rounded-xl relative"
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
                                className={cn(errors.root && "border border-destructive")}
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
                                className={cn(errors.root && "border border-destructive")}
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
                {errors.root && (
                    <div className="text-destructive absolute -bottom-5">
                        <small>{errors.root.message}</small>
                    </div>
                )}
            </form>
        </FormProvider>
    )
}

import {FormProvider, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Input} from "@/components/ui/common/input.tsx"
import {Label} from "@/components/ui/common/label.tsx"
import {Button} from "@/components/ui/common/button.tsx"
import {FormField, FormItem, FormMessage} from "@/components/ui/common/form.tsx"
import {cn} from "@/lib/utils"
import {ComponentProps} from "react"
import {signUpUser} from "@/features/auth/service/auth-service.ts";
import {toast} from "sonner";
import {useNavigate} from "@tanstack/react-router";

const signUpSchema = z.object({
    nameOfUser: z.string().min(1, {message: "Name cannot be empty"}),
    email: z.string().email({message: "Please provide a valid e-mail."}),
    password: z.string().min(6, {message: "Your password is not strong enough - Try again!"}),
})

export function SignUpForm({className, ...props}: ComponentProps<"form">) {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            nameOfUser: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        try {
            await signUpUser(data);
            toast.success("Welcome, to the bright side of the receipts!")
            form.reset();
            await navigate({ to: '/dashboard' })
        } catch (e) {
            if(e instanceof Error) {
                toast.error(`Could not sign-up user! Error: ${e.message}`)
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
                    name="nameOfUser"
                    render={({field}) => (
                        <FormItem>
                            <Label htmlFor="name">Name</Label>
                            <Input {...field} id="nameOfUser" placeholder="Jane Doe"/>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <Label htmlFor="email">Email</Label>
                            <Input {...field} id="email" placeholder="mj@doe.com" type="email"/>
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
                            <Input {...field} id="password" type="password"/>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Sign-Up
                </Button>
            </form>
        </FormProvider>
    )
}

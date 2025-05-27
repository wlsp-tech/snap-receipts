import {FormProvider, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {FormField, FormItem, FormMessage} from "@/components/ui/form"
import {cn} from "@/lib/utils"
import {ComponentProps} from "react"

const signUpSchema = z.object({
    name: z.string().min(1, {message: "Name cannot be empty"}),
    email: z.string().email({message: "Please provide a valid e-mail."}),
    password: z.string().min(6, {message: "Your password is not strong enough - Try again!"}),
})

export function SignUpForm({className, ...props}: ComponentProps<"form">) {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof signUpSchema>) {
        console.log("Register data:", data)
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
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <Label htmlFor="name">Name</Label>
                            <Input {...field} id="name" placeholder="Jane Doe"/>
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

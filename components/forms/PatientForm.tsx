"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, getUserByCredentials, getUserByPhone } from "@/lib/actions/patient.actions"
import AlertLogin from "../AlertLogin"


export enum FormFieldType {
    INPUT = 'input',
    SELECT = 'select',
    TEXTAREA = 'textarea',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    FILE = 'file',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SKELETON = 'skeleton'
}


const PatientForm = () => {
    const router = useRouter();
    const [isLoading, setisLoading] = useState(false)

    // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async ({ name, email, phone }: z.infer<typeof UserFormValidation>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setisLoading(true);
        try {
            const userData = { name, email, phone };
            // const userExists = await getUsers(userData)
            const newUser = await createUser(userData);

            if (newUser) {
                console.log(newUser);
                router.push(`/patients/${newUser.$id}/register`)
            }
            else {
                console.log("User with the same email or phone already exists");
                const existingUser = await getUserByCredentials(email, phone)
                if (existingUser) {
                    console.log(existingUser);
                    router.push(`/?hasRegistered=true&existingUserId=${existingUser.$id}`)
                    // router.push(`/patients/${existingUser.$id}/new-appointment`)
                }
            }
        } catch (error) {
            console.log(error);
        }
        setisLoading(false);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4">
                <section className="mb-6 space-y-2">
                    <h1 className="text-xl font-bold">Hi there👋</h1>
                    <p className="text-dark-700">Schedule your first appointment.</p>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="user@example.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />
                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="12345 67890"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm
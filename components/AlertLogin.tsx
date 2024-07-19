'use client'

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPatient, getUserByCredentials } from '@/lib/actions/patient.actions';

interface UserProps {
    existingUserId?: string
}

const AlertLogin = async ({ existingUserId }: UserProps) => {
    const router = useRouter();
    const path = usePathname();
    const [open, setOpen] = useState(true);
    const [error, setError] = useState('')
    if (existingUserId) {
        try {
            const user = await getPatient(existingUserId);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    }

    const continueWithExisting = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        router.push(`/patients/${existingUserId}/new-appointment`)
        setOpen(false);
    }


    const closeModal = () => {
        setOpen(false);
        router.push('/');
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        User Already Exists
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        User already exists with this email or phone number. Do you want to continue with this email or phone number?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    {error && <p className="shad-error text-14-regular mt-2 flex justify-center">{error}</p>}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => closeModal()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => continueWithExisting(e)} className="shad-primary-btn">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default AlertLogin
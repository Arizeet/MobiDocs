'use client'

import React, { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { usePathname, useRouter } from "next/navigation";
import { getPatient } from '@/lib/actions/patient.actions';

interface UserProps {
    existingUserId?: string;
}

const AlertLogin = ({ existingUserId }: UserProps) => {
    const router = useRouter();
    const path = usePathname();
    const [open, setOpen] = useState(true);
    const [error, setError] = useState('');
    const [userDetails, setUserDetails] = useState<{ email: string; phone: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (existingUserId) {
                try {
                    const user = await getPatient(existingUserId);
                    setUserDetails({ email: user.email, phone: user.phone });
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                    setError('Failed to fetch user details');
                }
            }
        };

        fetchUser();
    }, [existingUserId]);

    const continueWithExisting = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        router.push(`/patients/${existingUserId}/new-appointment`);
        setOpen(false);
    };

    const closeModal = () => {
        setOpen(false);
        router.push('/');
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        User Already Exists
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        User already exists with this email or phone number. Do you want to continue with the below credentials?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    {error && <p className="shad-error text-14-regular mt-2 flex justify-center">{error}</p>}
                    {userDetails && (
                        <div>
                            <p>Email: {userDetails.email}</p>
                            <p>Phone: {userDetails.phone}</p>
                        </div>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => closeModal()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => continueWithExisting(e)} className="shad-primary-btn">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertLogin;

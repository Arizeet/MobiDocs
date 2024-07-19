import RegisterForm from '@/components/forms/RegisterForm'
import { getUsers } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'

const Register = async ({ params: { userId } }: SearchParamProps) => {

    const user = await getUsers(userId)
    Sentry.metrics.set("user_view_register", user.name);
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex flex-1 flex-col">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={500}
                        width={500}
                        alt="patient"
                        className="mb-2 h-8 w-fit"
                    />
                    <RegisterForm user={user} />
                    <p className="copyright py-10">
                        © Copyright MobiDocs
                    </p>
                </div>
            </section>
            <Image
                src="/assets/images/register-img.png"
                width={1000}
                height={1000}
                alt="patient"
                className="side-img max-w-[390px]"
            />
            {/* 390px->50% */}
        </div>
    )
}

export default Register
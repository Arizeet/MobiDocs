import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { getUsers } from '@/lib/actions/patient.actions';

const SuccessPage = async ({ params: { userId }, searchParams }: SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || '';
    const appointment = await getAppointment(appointmentId)
    const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician)
    const user = await getUsers(userId)

    Sentry.metrics.set("user_view_appointment-success", user.name);
    return (
        <div className='flex h-screen max-h-screen px-[5%]'>
            <div className='success-img'>
                <Link href='/'>
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={500}
                        width={500}
                        alt='logo'
                        className='h-6 w-fit'
                    />
                </Link>
                <section className='flex flex-col items-center'>
                    <Image
                        src="/assets/gifs/success.gif"
                        alt='success'
                        width={150}
                        height={150}
                    />
                    <h2 className='header mb-2 max-w-[600px] text-center'>
                        Your <span className='text-green-500'>appointment request</span>  has been successfully submitted!
                    </h2>
                    <p>We wll be in touch shortly to confirm.</p>
                </section>
                <section className='request-details'>
                    <p>Requested appointment details:</p>
                    <div className='flex items-center gap-3'>
                        <Image
                            src={doctor?.image!}
                            width={48}
                            height={48}
                            alt='doctor'
                            className='size-8'
                        />
                        <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
                    </div>
                    <div className='flex gap-2'>
                        <Image
                            src="/assets/icons/calendar.svg"
                            width={24}
                            height={24}
                            alt='calendar'
                        />
                        <p>{formatDateTime(appointment.schedule).dateTime}</p>
                    </div>
                </section>

                <Button variant={'outline'} className='shad-primary-btn' asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>
                </Button>

                <p className="copyright">
                    © Copyright MobiDocs
                </p>

            </div>
        </div>
    )
}

export default SuccessPage
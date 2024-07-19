import AppointmentForm from "@/components/forms/AppointmentForm"
import { getPatient } from "@/lib/actions/patient.actions"
import Image from "next/image"
import * as Sentry from '@sentry/nextjs'

export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
    const patient = await getPatient(userId)
    Sentry.metrics.set("user_view_new-appointment", patient.name);
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex flex-1 justify-between">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={500}
                        width={500}
                        alt="patient"
                        className="mb-2 h-8 w-fit"
                    />
                    <AppointmentForm
                        type="create"
                        userId={userId}
                        patientId={patient.$id}
                    />
                    <p className="copyright py-6">
                        © Copyright MobiDocs
                    </p>
                </div>
            </section>
            <Image
                src="/assets/images/appointment-img.png"
                width={1000}
                height={1000}
                alt="appointment"
                className="side-img max-w-[390px] bg-bottom"
            />
        </div>
    )
}

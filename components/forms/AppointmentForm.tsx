"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
    createAppointment,
    updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { FormFieldType } from "./PatientForm";


const AppointmentForm = ({
    userId, patientId, type, appointment, setOpen
}: {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
    appointment?: Appointment;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
    const router = useRouter();
    const [isLoading, setisLoading] = useState(false)

    const AppointmentFormValidation = getAppointmentSchema(type)

    // 1. Define your form.
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : '',
            schedule: appointment ? new Date(appointment.schedule!) : new Date(Date.now()),
            reason: appointment ? appointment.reason : '',
            note: appointment?.note || '',
            cancellationReason: appointment?.cancellationReason || '',
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setisLoading(true);
        let status;
        switch (type) {
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
                break;
        }
        try {
            if (type === "create" && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                }
                const appointment = await createAppointment(appointmentData)
                if (appointment) {
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
                }
            } else {
                console.log("Updating appointment");

                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type,
                };
                console.log('before updatedAppointment');

                const updatedAppointment = await updateAppointment(appointmentToUpdate);
                console.log('after updatedAppointment');

                if (updatedAppointment) {
                    setOpen && setOpen(false)
                    form.reset();
                }
            }
        } catch (error) {
            console.log('error in 111');

            console.log(error);
        }
        setisLoading(false);
    }

    let buttonLabel;
    switch (type) {
        case "create":
            buttonLabel = "Create Appointment";
            break;
        case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
        case "schedule":
            buttonLabel = "Schedule Appointment";
            break;
        default:
            break;
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4">
                {type === 'create' && <section className="mb-6 space-y-2">
                    <h1 className="text-xl font-bold">New Appointment</h1>
                    <p className="text-dark-700">Request a new appointment in 10 seconds</p>
                </section>}

                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a Doctor"
                        >
                            {Doctors.map((doctor) => (
                                <SelectItem key={doctor.name} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt={doctor.name}
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="dd/MM/yyyy - hh:mm aa"
                        />
                        <div className="flex flex-col gap-4 lg:flex-row">
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Reason for appointment"
                                placeholder="Enter reason for appointment"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Notes"
                                placeholder="Enter notes for appointment"
                            />
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Enter reason for cancellation"
                    />
                )}
                <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm
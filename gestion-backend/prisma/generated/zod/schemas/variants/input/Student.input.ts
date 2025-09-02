import { z } from 'zod';

import { StudentStatusSchema } from '../../enums/StudentStatus.schema';
// prettier-ignore
export const StudentInputSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    studentId: z.string(),
    email: z.string(),
    phone: z.string().optional().nullable(),
    dateOfBirth: z.date().optional().nullable(),
    placeOfBirth: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    photo: z.string().optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(),
    disabilities: z.string().optional().nullable(),
    status: StudentStatusSchema,
    user: z.unknown().optional().nullable(),
    userId: z.string().optional().nullable(),
    enrollments: z.array(z.unknown()),
    guardians: z.array(z.unknown()),
    grades: z.array(z.unknown()),
    retakes: z.array(z.unknown()),
    payments: z.array(z.unknown()),
    bookLoans: z.array(z.unknown()),
    transcripts: z.array(z.unknown()),
    attendances: z.array(z.unknown()),
    scholarshipApplications: z.array(z.unknown()),
    certificates: z.array(z.unknown())
}).strict();

export type StudentInputType = z.infer<typeof StudentInputSchema>;

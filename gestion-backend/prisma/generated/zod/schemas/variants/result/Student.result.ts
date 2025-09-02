import { z } from 'zod';

import { StudentStatusSchema } from '../../enums/StudentStatus.schema';
// prettier-ignore
export const StudentResultSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    studentId: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    dateOfBirth: z.date().nullable(),
    placeOfBirth: z.string().nullable(),
    address: z.string().nullable(),
    photo: z.string().nullable(),
    bloodGroup: z.string().nullable(),
    allergies: z.string().nullable(),
    disabilities: z.string().nullable(),
    status: StudentStatusSchema,
    user: z.unknown().nullable(),
    userId: z.string().nullable(),
    enrollments: z.array(z.unknown()),
    guardians: z.array(z.unknown()),
    grades: z.array(z.unknown()),
    retakes: z.array(z.unknown()),
    payments: z.array(z.unknown()),
    bookLoans: z.array(z.unknown()),
    transcripts: z.array(z.unknown()),
    attendances: z.array(z.unknown()),
    scholarshipApplications: z.array(z.unknown()),
    certificates: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type StudentResultType = z.infer<typeof StudentResultSchema>;

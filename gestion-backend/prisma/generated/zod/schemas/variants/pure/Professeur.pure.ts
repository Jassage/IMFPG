import { z } from 'zod';

import { UserStatusSchema } from '../../enums/UserStatus.schema';
// prettier-ignore
export const ProfesseurModelSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    department: z.string().nullable(),
    office: z.string().nullable(),
    hireDate: z.date().nullable(),
    status: UserStatusSchema,
    speciality: z.string().nullable(),
    user: z.unknown().nullable(),
    userId: z.string().nullable(),
    assignments: z.array(z.unknown()),
    schedules: z.array(z.unknown()),
    grades: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ProfesseurModelType = z.infer<typeof ProfesseurModelSchema>;

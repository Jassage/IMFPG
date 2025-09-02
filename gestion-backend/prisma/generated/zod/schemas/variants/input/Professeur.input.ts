import { z } from 'zod';

import { UserStatusSchema } from '../../enums/UserStatus.schema';
// prettier-ignore
export const ProfesseurInputSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    office: z.string().optional().nullable(),
    hireDate: z.date().optional().nullable(),
    status: UserStatusSchema,
    speciality: z.string().optional().nullable(),
    user: z.unknown().optional().nullable(),
    userId: z.string().optional().nullable(),
    assignments: z.array(z.unknown()),
    schedules: z.array(z.unknown()),
    grades: z.array(z.unknown())
}).strict();

export type ProfesseurInputType = z.infer<typeof ProfesseurInputSchema>;

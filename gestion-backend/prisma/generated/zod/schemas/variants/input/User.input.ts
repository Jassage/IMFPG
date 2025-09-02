import { z } from 'zod';

import { UserRoleSchema } from '../../enums/UserRole.schema';
import { UserStatusSchema } from '../../enums/UserStatus.schema';
// prettier-ignore
export const UserInputSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().optional().nullable(),
    role: UserRoleSchema,
    status: UserStatusSchema,
    lastLogin: z.date().optional().nullable(),
    avatar: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
    student: z.unknown().optional().nullable(),
    professeur: z.unknown().optional().nullable(),
    createdUEs: z.array(z.unknown())
}).strict();

export type UserInputType = z.infer<typeof UserInputSchema>;

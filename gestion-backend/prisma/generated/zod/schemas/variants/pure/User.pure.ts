import { z } from 'zod';

import { UserRoleSchema } from '../../enums/UserRole.schema';
import { UserStatusSchema } from '../../enums/UserStatus.schema';
// prettier-ignore
export const UserModelSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    role: UserRoleSchema,
    status: UserStatusSchema,
    lastLogin: z.date().nullable(),
    avatar: z.string().nullable(),
    password: z.string().nullable(),
    student: z.unknown().nullable(),
    professeur: z.unknown().nullable(),
    createdUEs: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type UserModelType = z.infer<typeof UserModelSchema>;

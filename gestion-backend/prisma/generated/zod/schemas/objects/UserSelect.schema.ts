import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { ProfesseurArgsObjectSchema } from './ProfesseurArgs.schema';
import { UEFindManySchema } from '../findManyUE.schema';
import { UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

export const UserSelectObjectSchema: z.ZodType<Prisma.UserSelect, z.ZodTypeDef, Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  role: z.boolean().optional(),
  status: z.boolean().optional(),
  lastLogin: z.boolean().optional(),
  avatar: z.boolean().optional(),
  password: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  createdUEs: z.union([z.boolean(), z.lazy(() => UEFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  role: z.boolean().optional(),
  status: z.boolean().optional(),
  lastLogin: z.boolean().optional(),
  avatar: z.boolean().optional(),
  password: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  createdUEs: z.union([z.boolean(), z.lazy(() => UEFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();

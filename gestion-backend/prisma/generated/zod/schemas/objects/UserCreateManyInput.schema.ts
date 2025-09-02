import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema'

export const UserCreateManyInputObjectSchema: z.ZodType<Prisma.UserCreateManyInput, z.ZodTypeDef, Prisma.UserCreateManyInput> = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  lastLogin: z.date().nullish(),
  avatar: z.string().nullish(),
  password: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UserCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  lastLogin: z.date().nullish(),
  avatar: z.string().nullish(),
  password: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();

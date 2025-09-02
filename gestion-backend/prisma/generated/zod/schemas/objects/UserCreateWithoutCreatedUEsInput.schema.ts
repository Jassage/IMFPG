import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { StudentCreateNestedOneWithoutUserInputObjectSchema } from './StudentCreateNestedOneWithoutUserInput.schema';
import { ProfesseurCreateNestedOneWithoutUserInputObjectSchema } from './ProfesseurCreateNestedOneWithoutUserInput.schema'

export const UserCreateWithoutCreatedUEsInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutCreatedUEsInput, z.ZodTypeDef, Prisma.UserCreateWithoutCreatedUEsInput> = z.object({
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
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutUserInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutCreatedUEsInputObjectZodSchema = z.object({
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
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutUserInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutUserInputObjectSchema).optional()
}).strict();

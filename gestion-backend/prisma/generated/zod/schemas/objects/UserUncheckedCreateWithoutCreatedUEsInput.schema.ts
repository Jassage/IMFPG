import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { StudentUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './StudentUncheckedCreateNestedOneWithoutUserInput.schema';
import { ProfesseurUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './ProfesseurUncheckedCreateNestedOneWithoutUserInput.schema'

export const UserUncheckedCreateWithoutCreatedUEsInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCreatedUEsInput, z.ZodTypeDef, Prisma.UserUncheckedCreateWithoutCreatedUEsInput> = z.object({
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
  student: z.lazy(() => StudentUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutCreatedUEsInputObjectZodSchema = z.object({
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
  student: z.lazy(() => StudentUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional()
}).strict();

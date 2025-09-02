import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { ProfesseurUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './ProfesseurUncheckedCreateNestedOneWithoutUserInput.schema';
import { UEUncheckedCreateNestedManyWithoutCreatedByInputObjectSchema } from './UEUncheckedCreateNestedManyWithoutCreatedByInput.schema'

export const UserUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.UserUncheckedCreateWithoutStudentInput> = z.object({
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
  professeur: z.lazy(() => ProfesseurUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  createdUEs: z.lazy(() => UEUncheckedCreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
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
  professeur: z.lazy(() => ProfesseurUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  createdUEs: z.lazy(() => UEUncheckedCreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();

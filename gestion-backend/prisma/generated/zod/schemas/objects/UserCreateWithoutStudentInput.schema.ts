import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { ProfesseurCreateNestedOneWithoutUserInputObjectSchema } from './ProfesseurCreateNestedOneWithoutUserInput.schema';
import { UECreateNestedManyWithoutCreatedByInputObjectSchema } from './UECreateNestedManyWithoutCreatedByInput.schema'

export const UserCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutStudentInput, z.ZodTypeDef, Prisma.UserCreateWithoutStudentInput> = z.object({
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
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutUserInputObjectSchema).optional(),
  createdUEs: z.lazy(() => UECreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutStudentInputObjectZodSchema = z.object({
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
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutUserInputObjectSchema).optional(),
  createdUEs: z.lazy(() => UECreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();

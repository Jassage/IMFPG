import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { StudentUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './StudentUncheckedCreateNestedOneWithoutUserInput.schema';
import { UEUncheckedCreateNestedManyWithoutCreatedByInputObjectSchema } from './UEUncheckedCreateNestedManyWithoutCreatedByInput.schema'

export const UserUncheckedCreateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProfesseurInput, z.ZodTypeDef, Prisma.UserUncheckedCreateWithoutProfesseurInput> = z.object({
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
  createdUEs: z.lazy(() => UEUncheckedCreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutProfesseurInputObjectZodSchema = z.object({
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
  createdUEs: z.lazy(() => UEUncheckedCreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();

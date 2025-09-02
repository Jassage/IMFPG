import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { StudentCreateNestedOneWithoutUserInputObjectSchema } from './StudentCreateNestedOneWithoutUserInput.schema';
import { UECreateNestedManyWithoutCreatedByInputObjectSchema } from './UECreateNestedManyWithoutCreatedByInput.schema'

export const UserCreateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutProfesseurInput, z.ZodTypeDef, Prisma.UserCreateWithoutProfesseurInput> = z.object({
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
  createdUEs: z.lazy(() => UECreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutProfesseurInputObjectZodSchema = z.object({
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
  createdUEs: z.lazy(() => UECreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();

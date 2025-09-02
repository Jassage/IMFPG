import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserUpdateWithoutStudentInputObjectSchema } from './UserUpdateWithoutStudentInput.schema';
import { UserUncheckedUpdateWithoutStudentInputObjectSchema } from './UserUncheckedUpdateWithoutStudentInput.schema';
import { UserCreateWithoutStudentInputObjectSchema } from './UserCreateWithoutStudentInput.schema';
import { UserUncheckedCreateWithoutStudentInputObjectSchema } from './UserUncheckedCreateWithoutStudentInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema'

export const UserUpsertWithoutStudentInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutStudentInput, z.ZodTypeDef, Prisma.UserUpsertWithoutStudentInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutStudentInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutStudentInputObjectSchema } from './UserUpdateWithoutStudentInput.schema';
import { UserUncheckedUpdateWithoutStudentInputObjectSchema } from './UserUncheckedUpdateWithoutStudentInput.schema'

export const UserUpdateToOneWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.UserUpdateToOneWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();

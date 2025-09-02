import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutStudentInputObjectSchema } from './UserCreateWithoutStudentInput.schema';
import { UserUncheckedCreateWithoutStudentInputObjectSchema } from './UserUncheckedCreateWithoutStudentInput.schema'

export const UserCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.UserCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();

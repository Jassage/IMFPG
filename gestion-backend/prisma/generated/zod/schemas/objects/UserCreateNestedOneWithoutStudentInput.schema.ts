import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserCreateWithoutStudentInputObjectSchema } from './UserCreateWithoutStudentInput.schema';
import { UserUncheckedCreateWithoutStudentInputObjectSchema } from './UserUncheckedCreateWithoutStudentInput.schema';
import { UserCreateOrConnectWithoutStudentInputObjectSchema } from './UserCreateOrConnectWithoutStudentInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

export const UserCreateNestedOneWithoutStudentInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutStudentInput, z.ZodTypeDef, Prisma.UserCreateNestedOneWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStudentInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStudentInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();

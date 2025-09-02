import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserCreateWithoutStudentInputObjectSchema } from './UserCreateWithoutStudentInput.schema';
import { UserUncheckedCreateWithoutStudentInputObjectSchema } from './UserUncheckedCreateWithoutStudentInput.schema';
import { UserCreateOrConnectWithoutStudentInputObjectSchema } from './UserCreateOrConnectWithoutStudentInput.schema';
import { UserUpsertWithoutStudentInputObjectSchema } from './UserUpsertWithoutStudentInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutStudentInputObjectSchema } from './UserUpdateToOneWithWhereWithoutStudentInput.schema';
import { UserUpdateWithoutStudentInputObjectSchema } from './UserUpdateWithoutStudentInput.schema';
import { UserUncheckedUpdateWithoutStudentInputObjectSchema } from './UserUncheckedUpdateWithoutStudentInput.schema'

export const UserUpdateOneWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutStudentNestedInput, z.ZodTypeDef, Prisma.UserUpdateOneWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStudentInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutStudentInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutStudentInputObjectSchema), z.lazy(() => UserUpdateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutStudentInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutStudentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStudentInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutStudentInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutStudentInputObjectSchema), z.lazy(() => UserUpdateWithoutStudentInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutStudentInputObjectSchema)]).optional()
}).strict();

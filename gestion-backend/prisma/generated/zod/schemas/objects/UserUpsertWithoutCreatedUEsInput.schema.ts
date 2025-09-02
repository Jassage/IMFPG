import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserUpdateWithoutCreatedUEsInputObjectSchema } from './UserUpdateWithoutCreatedUEsInput.schema';
import { UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema } from './UserUncheckedUpdateWithoutCreatedUEsInput.schema';
import { UserCreateWithoutCreatedUEsInputObjectSchema } from './UserCreateWithoutCreatedUEsInput.schema';
import { UserUncheckedCreateWithoutCreatedUEsInputObjectSchema } from './UserUncheckedCreateWithoutCreatedUEsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema'

export const UserUpsertWithoutCreatedUEsInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutCreatedUEsInput, z.ZodTypeDef, Prisma.UserUpsertWithoutCreatedUEsInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutCreatedUEsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();

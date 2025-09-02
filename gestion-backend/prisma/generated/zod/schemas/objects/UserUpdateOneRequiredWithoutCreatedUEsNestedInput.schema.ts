import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserCreateWithoutCreatedUEsInputObjectSchema } from './UserCreateWithoutCreatedUEsInput.schema';
import { UserUncheckedCreateWithoutCreatedUEsInputObjectSchema } from './UserUncheckedCreateWithoutCreatedUEsInput.schema';
import { UserCreateOrConnectWithoutCreatedUEsInputObjectSchema } from './UserCreateOrConnectWithoutCreatedUEsInput.schema';
import { UserUpsertWithoutCreatedUEsInputObjectSchema } from './UserUpsertWithoutCreatedUEsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutCreatedUEsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutCreatedUEsInput.schema';
import { UserUpdateWithoutCreatedUEsInputObjectSchema } from './UserUpdateWithoutCreatedUEsInput.schema';
import { UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema } from './UserUncheckedUpdateWithoutCreatedUEsInput.schema'

export const UserUpdateOneRequiredWithoutCreatedUEsNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCreatedUEsNestedInput, z.ZodTypeDef, Prisma.UserUpdateOneRequiredWithoutCreatedUEsNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedUEsInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCreatedUEsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUpdateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutCreatedUEsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedUEsInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCreatedUEsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUpdateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema)]).optional()
}).strict();

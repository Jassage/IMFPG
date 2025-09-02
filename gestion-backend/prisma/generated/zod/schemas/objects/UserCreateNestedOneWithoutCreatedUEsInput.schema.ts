import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserCreateWithoutCreatedUEsInputObjectSchema } from './UserCreateWithoutCreatedUEsInput.schema';
import { UserUncheckedCreateWithoutCreatedUEsInputObjectSchema } from './UserUncheckedCreateWithoutCreatedUEsInput.schema';
import { UserCreateOrConnectWithoutCreatedUEsInputObjectSchema } from './UserCreateOrConnectWithoutCreatedUEsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

export const UserCreateNestedOneWithoutCreatedUEsInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCreatedUEsInput, z.ZodTypeDef, Prisma.UserCreateNestedOneWithoutCreatedUEsInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedUEsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutCreatedUEsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedUEsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();

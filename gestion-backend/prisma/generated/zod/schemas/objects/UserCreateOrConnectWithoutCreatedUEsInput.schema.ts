import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutCreatedUEsInputObjectSchema } from './UserCreateWithoutCreatedUEsInput.schema';
import { UserUncheckedCreateWithoutCreatedUEsInputObjectSchema } from './UserUncheckedCreateWithoutCreatedUEsInput.schema'

export const UserCreateOrConnectWithoutCreatedUEsInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCreatedUEsInput, z.ZodTypeDef, Prisma.UserCreateOrConnectWithoutCreatedUEsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutCreatedUEsInputObjectZodSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedUEsInputObjectSchema)])
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutCreatedUEsInputObjectSchema } from './UserUpdateWithoutCreatedUEsInput.schema';
import { UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema } from './UserUncheckedUpdateWithoutCreatedUEsInput.schema'

export const UserUpdateToOneWithWhereWithoutCreatedUEsInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCreatedUEsInput, z.ZodTypeDef, Prisma.UserUpdateToOneWithWhereWithoutCreatedUEsInput> = z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutCreatedUEsInputObjectZodSchema = z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutCreatedUEsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedUEsInputObjectSchema)])
}).strict();

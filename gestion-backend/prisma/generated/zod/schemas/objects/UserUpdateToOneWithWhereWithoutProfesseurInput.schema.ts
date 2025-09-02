import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutProfesseurInputObjectSchema } from './UserUpdateWithoutProfesseurInput.schema';
import { UserUncheckedUpdateWithoutProfesseurInputObjectSchema } from './UserUncheckedUpdateWithoutProfesseurInput.schema'

export const UserUpdateToOneWithWhereWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProfesseurInput, z.ZodTypeDef, Prisma.UserUpdateToOneWithWhereWithoutProfesseurInput> = z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserUpdateWithoutProfesseurInputObjectSchema } from './UserUpdateWithoutProfesseurInput.schema';
import { UserUncheckedUpdateWithoutProfesseurInputObjectSchema } from './UserUncheckedUpdateWithoutProfesseurInput.schema';
import { UserCreateWithoutProfesseurInputObjectSchema } from './UserCreateWithoutProfesseurInput.schema';
import { UserUncheckedCreateWithoutProfesseurInputObjectSchema } from './UserUncheckedCreateWithoutProfesseurInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema'

export const UserUpsertWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutProfesseurInput, z.ZodTypeDef, Prisma.UserUpsertWithoutProfesseurInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutProfesseurInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();

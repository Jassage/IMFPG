import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserCreateWithoutProfesseurInputObjectSchema } from './UserCreateWithoutProfesseurInput.schema';
import { UserUncheckedCreateWithoutProfesseurInputObjectSchema } from './UserUncheckedCreateWithoutProfesseurInput.schema';
import { UserCreateOrConnectWithoutProfesseurInputObjectSchema } from './UserCreateOrConnectWithoutProfesseurInput.schema';
import { UserUpsertWithoutProfesseurInputObjectSchema } from './UserUpsertWithoutProfesseurInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutProfesseurInputObjectSchema } from './UserUpdateToOneWithWhereWithoutProfesseurInput.schema';
import { UserUpdateWithoutProfesseurInputObjectSchema } from './UserUpdateWithoutProfesseurInput.schema';
import { UserUncheckedUpdateWithoutProfesseurInputObjectSchema } from './UserUncheckedUpdateWithoutProfesseurInput.schema'

export const UserUpdateOneWithoutProfesseurNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutProfesseurNestedInput, z.ZodTypeDef, Prisma.UserUpdateOneWithoutProfesseurNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfesseurInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProfesseurInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => UserUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutProfesseurInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutProfesseurNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfesseurInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProfesseurInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => UserUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutProfesseurInputObjectSchema)]).optional()
}).strict();

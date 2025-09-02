import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserCreateWithoutProfesseurInputObjectSchema } from './UserCreateWithoutProfesseurInput.schema';
import { UserUncheckedCreateWithoutProfesseurInputObjectSchema } from './UserUncheckedCreateWithoutProfesseurInput.schema';
import { UserCreateOrConnectWithoutProfesseurInputObjectSchema } from './UserCreateOrConnectWithoutProfesseurInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

export const UserCreateNestedOneWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutProfesseurInput, z.ZodTypeDef, Prisma.UserCreateNestedOneWithoutProfesseurInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfesseurInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutProfesseurInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfesseurInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutProfesseurInputObjectSchema } from './UserCreateWithoutProfesseurInput.schema';
import { UserUncheckedCreateWithoutProfesseurInputObjectSchema } from './UserUncheckedCreateWithoutProfesseurInput.schema'

export const UserCreateOrConnectWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutProfesseurInput, z.ZodTypeDef, Prisma.UserCreateOrConnectWithoutProfesseurInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutProfesseurInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianWhereUniqueInputObjectSchema } from './GuardianWhereUniqueInput.schema';
import { GuardianUpdateWithoutStudentInputObjectSchema } from './GuardianUpdateWithoutStudentInput.schema';
import { GuardianUncheckedUpdateWithoutStudentInputObjectSchema } from './GuardianUncheckedUpdateWithoutStudentInput.schema';
import { GuardianCreateWithoutStudentInputObjectSchema } from './GuardianCreateWithoutStudentInput.schema';
import { GuardianUncheckedCreateWithoutStudentInputObjectSchema } from './GuardianUncheckedCreateWithoutStudentInput.schema'

export const GuardianUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.GuardianUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.GuardianUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => GuardianWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GuardianUpdateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const GuardianUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GuardianWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GuardianUpdateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();

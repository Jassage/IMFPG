import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianWhereUniqueInputObjectSchema } from './GuardianWhereUniqueInput.schema';
import { GuardianUpdateWithoutStudentInputObjectSchema } from './GuardianUpdateWithoutStudentInput.schema';
import { GuardianUncheckedUpdateWithoutStudentInputObjectSchema } from './GuardianUncheckedUpdateWithoutStudentInput.schema'

export const GuardianUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.GuardianUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.GuardianUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => GuardianWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GuardianUpdateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const GuardianUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GuardianWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GuardianUpdateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();

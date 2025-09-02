import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeUpdateWithoutStudentInputObjectSchema } from './RetakeUpdateWithoutStudentInput.schema';
import { RetakeUncheckedUpdateWithoutStudentInputObjectSchema } from './RetakeUncheckedUpdateWithoutStudentInput.schema'

export const RetakeUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const RetakeUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();

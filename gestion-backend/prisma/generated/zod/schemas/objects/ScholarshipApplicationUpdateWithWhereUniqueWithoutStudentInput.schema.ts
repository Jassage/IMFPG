import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationUpdateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUpdateWithoutStudentInput.schema';
import { ScholarshipApplicationUncheckedUpdateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateWithoutStudentInput.schema'

export const ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();

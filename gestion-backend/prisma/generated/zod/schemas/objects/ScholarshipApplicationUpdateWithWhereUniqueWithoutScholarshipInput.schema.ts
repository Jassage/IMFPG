import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationUpdateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUpdateWithoutScholarshipInput.schema';
import { ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateWithoutScholarshipInput.schema'

export const ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectSchema)])
}).strict();
export const ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectSchema)])
}).strict();

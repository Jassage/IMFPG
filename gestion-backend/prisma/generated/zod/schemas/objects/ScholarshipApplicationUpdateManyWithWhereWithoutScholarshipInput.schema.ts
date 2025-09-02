import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationScalarWhereInputObjectSchema } from './ScholarshipApplicationScalarWhereInput.schema';
import { ScholarshipApplicationUpdateManyMutationInputObjectSchema } from './ScholarshipApplicationUpdateManyMutationInput.schema';
import { ScholarshipApplicationUncheckedUpdateManyWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateManyWithoutScholarshipInput.schema'

export const ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateManyWithoutScholarshipInputObjectSchema)])
}).strict();
export const ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateManyWithoutScholarshipInputObjectSchema)])
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationScalarWhereInputObjectSchema } from './ScholarshipApplicationScalarWhereInput.schema';
import { ScholarshipApplicationUpdateManyMutationInputObjectSchema } from './ScholarshipApplicationUpdateManyMutationInput.schema';
import { ScholarshipApplicationUncheckedUpdateManyWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateManyWithoutStudentInput.schema'

export const ScholarshipApplicationUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const ScholarshipApplicationUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();

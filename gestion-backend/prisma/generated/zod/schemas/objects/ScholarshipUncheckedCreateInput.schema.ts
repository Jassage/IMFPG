import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInput.schema'

export const ScholarshipUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ScholarshipUncheckedCreateInput, z.ZodTypeDef, Prisma.ScholarshipUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  academicYearId: z.string(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  applications: z.lazy(() => ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();
export const ScholarshipUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  academicYearId: z.string(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  applications: z.lazy(() => ScholarshipApplicationUncheckedCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();

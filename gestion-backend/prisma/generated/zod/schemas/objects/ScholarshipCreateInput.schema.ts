import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateNestedOneWithoutScholarshipInputObjectSchema } from './AcademicYearCreateNestedOneWithoutScholarshipInput.schema';
import { ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateNestedManyWithoutScholarshipInput.schema'

export const ScholarshipCreateInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateInput, z.ZodTypeDef, Prisma.ScholarshipCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutScholarshipInputObjectSchema),
  applications: z.lazy(() => ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();
export const ScholarshipCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutScholarshipInputObjectSchema),
  applications: z.lazy(() => ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();

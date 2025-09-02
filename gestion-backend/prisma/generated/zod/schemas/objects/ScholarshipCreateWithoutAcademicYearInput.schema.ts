import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateNestedManyWithoutScholarshipInput.schema'

export const ScholarshipCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  applications: z.lazy(() => ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();
export const ScholarshipCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  applications: z.lazy(() => ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectSchema).optional()
}).strict();

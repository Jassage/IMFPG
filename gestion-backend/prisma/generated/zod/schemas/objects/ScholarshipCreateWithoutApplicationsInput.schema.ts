import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateNestedOneWithoutScholarshipInputObjectSchema } from './AcademicYearCreateNestedOneWithoutScholarshipInput.schema'

export const ScholarshipCreateWithoutApplicationsInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateWithoutApplicationsInput, z.ZodTypeDef, Prisma.ScholarshipCreateWithoutApplicationsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutScholarshipInputObjectSchema)
}).strict();
export const ScholarshipCreateWithoutApplicationsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string(),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutScholarshipInputObjectSchema)
}).strict();

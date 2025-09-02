import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipCreateManyAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateManyAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipCreateManyAcademicYearInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string()
}).strict();
export const ScholarshipCreateManyAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string()
}).strict();

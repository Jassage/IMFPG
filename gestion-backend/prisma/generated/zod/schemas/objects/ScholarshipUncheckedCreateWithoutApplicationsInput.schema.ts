import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema: z.ZodType<Prisma.ScholarshipUncheckedCreateWithoutApplicationsInput, z.ZodTypeDef, Prisma.ScholarshipUncheckedCreateWithoutApplicationsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  academicYearId: z.string(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string()
}).strict();
export const ScholarshipUncheckedCreateWithoutApplicationsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullish(),
  amount: z.number(),
  criteria: z.string().nullish(),
  applicationDeadline: z.date(),
  academicYearId: z.string(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int().optional(),
  status: z.string()
}).strict();

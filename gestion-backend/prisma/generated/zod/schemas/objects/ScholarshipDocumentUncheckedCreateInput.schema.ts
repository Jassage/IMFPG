import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUncheckedCreateInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  scholarshipApplicationId: z.string(),
  url: z.string()
}).strict();
export const ScholarshipDocumentUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scholarshipApplicationId: z.string(),
  url: z.string()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentCreateManyInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCreateManyInput, z.ZodTypeDef, Prisma.ScholarshipDocumentCreateManyInput> = z.object({
  id: z.string().optional(),
  scholarshipApplicationId: z.string(),
  url: z.string()
}).strict();
export const ScholarshipDocumentCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scholarshipApplicationId: z.string(),
  url: z.string()
}).strict();

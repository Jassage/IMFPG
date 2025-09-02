import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentCreateManyScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCreateManyScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentCreateManyScholarshipApplicationInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const ScholarshipDocumentCreateManyScholarshipApplicationInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();

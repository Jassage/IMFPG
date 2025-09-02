import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCreateWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentCreateWithoutScholarshipApplicationInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();

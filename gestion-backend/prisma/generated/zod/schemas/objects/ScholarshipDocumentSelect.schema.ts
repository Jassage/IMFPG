import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationArgsObjectSchema } from './ScholarshipApplicationArgs.schema'

export const ScholarshipDocumentSelectObjectSchema: z.ZodType<Prisma.ScholarshipDocumentSelect, z.ZodTypeDef, Prisma.ScholarshipDocumentSelect> = z.object({
  id: z.boolean().optional(),
  scholarshipApplicationId: z.boolean().optional(),
  scholarshipApplication: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationArgsObjectSchema)]).optional(),
  url: z.boolean().optional()
}).strict();
export const ScholarshipDocumentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  scholarshipApplicationId: z.boolean().optional(),
  scholarshipApplication: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationArgsObjectSchema)]).optional(),
  url: z.boolean().optional()
}).strict();

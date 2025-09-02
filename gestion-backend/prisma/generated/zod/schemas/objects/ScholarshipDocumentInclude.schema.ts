import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationArgsObjectSchema } from './ScholarshipApplicationArgs.schema'

export const ScholarshipDocumentIncludeObjectSchema: z.ZodType<Prisma.ScholarshipDocumentInclude, z.ZodTypeDef, Prisma.ScholarshipDocumentInclude> = z.object({
  scholarshipApplication: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationArgsObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentIncludeObjectZodSchema = z.object({
  scholarshipApplication: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationArgsObjectSchema)]).optional()
}).strict();

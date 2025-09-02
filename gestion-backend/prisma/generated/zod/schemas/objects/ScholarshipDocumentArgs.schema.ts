import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentSelectObjectSchema } from './ScholarshipDocumentSelect.schema';
import { ScholarshipDocumentIncludeObjectSchema } from './ScholarshipDocumentInclude.schema'

export const ScholarshipDocumentArgsObjectSchema = z.object({
  select: z.lazy(() => ScholarshipDocumentSelectObjectSchema).optional(),
  include: z.lazy(() => ScholarshipDocumentIncludeObjectSchema).optional()
}).strict();
export const ScholarshipDocumentArgsObjectZodSchema = z.object({
  select: z.lazy(() => ScholarshipDocumentSelectObjectSchema).optional(),
  include: z.lazy(() => ScholarshipDocumentIncludeObjectSchema).optional()
}).strict();

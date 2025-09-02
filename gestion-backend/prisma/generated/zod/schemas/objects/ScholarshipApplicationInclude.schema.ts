import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipArgsObjectSchema } from './ScholarshipArgs.schema';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { ScholarshipDocumentFindManySchema } from '../findManyScholarshipDocument.schema';
import { ScholarshipApplicationCountOutputTypeArgsObjectSchema } from './ScholarshipApplicationCountOutputTypeArgs.schema'

export const ScholarshipApplicationIncludeObjectSchema: z.ZodType<Prisma.ScholarshipApplicationInclude, z.ZodTypeDef, Prisma.ScholarshipApplicationInclude> = z.object({
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipArgsObjectSchema)]).optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  documents: z.union([z.boolean(), z.lazy(() => ScholarshipDocumentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ScholarshipApplicationIncludeObjectZodSchema = z.object({
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipArgsObjectSchema)]).optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  documents: z.union([z.boolean(), z.lazy(() => ScholarshipDocumentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();

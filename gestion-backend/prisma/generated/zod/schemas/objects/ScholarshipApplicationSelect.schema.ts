import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipArgsObjectSchema } from './ScholarshipArgs.schema';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { ScholarshipDocumentFindManySchema } from '../findManyScholarshipDocument.schema';
import { ScholarshipApplicationCountOutputTypeArgsObjectSchema } from './ScholarshipApplicationCountOutputTypeArgs.schema'

export const ScholarshipApplicationSelectObjectSchema: z.ZodType<Prisma.ScholarshipApplicationSelect, z.ZodTypeDef, Prisma.ScholarshipApplicationSelect> = z.object({
  id: z.boolean().optional(),
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipArgsObjectSchema)]).optional(),
  scholarshipId: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  applicationDate: z.boolean().optional(),
  documents: z.union([z.boolean(), z.lazy(() => ScholarshipDocumentFindManySchema)]).optional(),
  motivation: z.boolean().optional(),
  status: z.boolean().optional(),
  reviewNotes: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ScholarshipApplicationSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipArgsObjectSchema)]).optional(),
  scholarshipId: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  applicationDate: z.boolean().optional(),
  documents: z.union([z.boolean(), z.lazy(() => ScholarshipDocumentFindManySchema)]).optional(),
  motivation: z.boolean().optional(),
  status: z.boolean().optional(),
  reviewNotes: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();

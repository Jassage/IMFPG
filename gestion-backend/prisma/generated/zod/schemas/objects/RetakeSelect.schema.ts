import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { UEArgsObjectSchema } from './UEArgs.schema'

export const RetakeSelectObjectSchema: z.ZodType<Prisma.RetakeSelect, z.ZodTypeDef, Prisma.RetakeSelect> = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  ueId: z.boolean().optional(),
  originalGrade: z.boolean().optional(),
  retakeGrade: z.boolean().optional(),
  scheduledSemester: z.boolean().optional(),
  status: z.boolean().optional()
}).strict();
export const RetakeSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  ueId: z.boolean().optional(),
  originalGrade: z.boolean().optional(),
  retakeGrade: z.boolean().optional(),
  scheduledSemester: z.boolean().optional(),
  status: z.boolean().optional()
}).strict();

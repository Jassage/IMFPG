import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { UEOrderByWithRelationInputObjectSchema } from './UEOrderByWithRelationInput.schema';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './AcademicYearOrderByWithRelationInput.schema';
import { TranscriptOrderByWithRelationInputObjectSchema } from './TranscriptOrderByWithRelationInput.schema';
import { ProfesseurOrderByWithRelationInputObjectSchema } from './ProfesseurOrderByWithRelationInput.schema';
import { GradeOrderByRelevanceInputObjectSchema } from './GradeOrderByRelevanceInput.schema'

export const GradeOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.GradeOrderByWithRelationInput, z.ZodTypeDef, Prisma.GradeOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  grade: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  session: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  transcriptId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  transcript: z.lazy(() => TranscriptOrderByWithRelationInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => GradeOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const GradeOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  grade: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  session: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  transcriptId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  transcript: z.lazy(() => TranscriptOrderByWithRelationInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => GradeOrderByRelevanceInputObjectSchema).optional()
}).strict();

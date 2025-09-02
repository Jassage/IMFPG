import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { StudentCreateNestedOneWithoutGradesInputObjectSchema } from './StudentCreateNestedOneWithoutGradesInput.schema';
import { AcademicYearCreateNestedOneWithoutGradesInputObjectSchema } from './AcademicYearCreateNestedOneWithoutGradesInput.schema';
import { TranscriptCreateNestedOneWithoutGradesInputObjectSchema } from './TranscriptCreateNestedOneWithoutGradesInput.schema';
import { ProfesseurCreateNestedOneWithoutGradesInputObjectSchema } from './ProfesseurCreateNestedOneWithoutGradesInput.schema'

export const GradeCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.GradeCreateWithoutUeInput, z.ZodTypeDef, Prisma.GradeCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGradesInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutGradesInputObjectSchema),
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();
export const GradeCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGradesInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutGradesInputObjectSchema),
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();

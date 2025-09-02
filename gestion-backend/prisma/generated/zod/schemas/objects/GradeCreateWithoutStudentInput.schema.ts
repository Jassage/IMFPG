import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { UECreateNestedOneWithoutGradesInputObjectSchema } from './UECreateNestedOneWithoutGradesInput.schema';
import { AcademicYearCreateNestedOneWithoutGradesInputObjectSchema } from './AcademicYearCreateNestedOneWithoutGradesInput.schema';
import { TranscriptCreateNestedOneWithoutGradesInputObjectSchema } from './TranscriptCreateNestedOneWithoutGradesInput.schema';
import { ProfesseurCreateNestedOneWithoutGradesInputObjectSchema } from './ProfesseurCreateNestedOneWithoutGradesInput.schema'

export const GradeCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.GradeCreateWithoutStudentInput, z.ZodTypeDef, Prisma.GradeCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutGradesInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutGradesInputObjectSchema),
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();
export const GradeCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutGradesInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutGradesInputObjectSchema),
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();

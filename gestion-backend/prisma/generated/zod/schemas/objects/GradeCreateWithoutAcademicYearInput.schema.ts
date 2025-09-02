import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { StudentCreateNestedOneWithoutGradesInputObjectSchema } from './StudentCreateNestedOneWithoutGradesInput.schema';
import { UECreateNestedOneWithoutGradesInputObjectSchema } from './UECreateNestedOneWithoutGradesInput.schema';
import { TranscriptCreateNestedOneWithoutGradesInputObjectSchema } from './TranscriptCreateNestedOneWithoutGradesInput.schema';
import { ProfesseurCreateNestedOneWithoutGradesInputObjectSchema } from './ProfesseurCreateNestedOneWithoutGradesInput.schema'

export const GradeCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.GradeCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.GradeCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGradesInputObjectSchema),
  ue: z.lazy(() => UECreateNestedOneWithoutGradesInputObjectSchema),
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();
export const GradeCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGradesInputObjectSchema),
  ue: z.lazy(() => UECreateNestedOneWithoutGradesInputObjectSchema),
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();

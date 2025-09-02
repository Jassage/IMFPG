import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { StudentCreateNestedOneWithoutGradesInputObjectSchema } from './StudentCreateNestedOneWithoutGradesInput.schema';
import { UECreateNestedOneWithoutGradesInputObjectSchema } from './UECreateNestedOneWithoutGradesInput.schema';
import { AcademicYearCreateNestedOneWithoutGradesInputObjectSchema } from './AcademicYearCreateNestedOneWithoutGradesInput.schema';
import { ProfesseurCreateNestedOneWithoutGradesInputObjectSchema } from './ProfesseurCreateNestedOneWithoutGradesInput.schema'

export const GradeCreateWithoutTranscriptInputObjectSchema: z.ZodType<Prisma.GradeCreateWithoutTranscriptInput, z.ZodTypeDef, Prisma.GradeCreateWithoutTranscriptInput> = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGradesInputObjectSchema),
  ue: z.lazy(() => UECreateNestedOneWithoutGradesInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutGradesInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();
export const GradeCreateWithoutTranscriptInputObjectZodSchema = z.object({
  id: z.string().optional(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  createdAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGradesInputObjectSchema),
  ue: z.lazy(() => UECreateNestedOneWithoutGradesInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutGradesInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();

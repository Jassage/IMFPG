import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { StudentCreateNestedOneWithoutGradesInputObjectSchema } from './StudentCreateNestedOneWithoutGradesInput.schema';
import { UECreateNestedOneWithoutGradesInputObjectSchema } from './UECreateNestedOneWithoutGradesInput.schema';
import { AcademicYearCreateNestedOneWithoutGradesInputObjectSchema } from './AcademicYearCreateNestedOneWithoutGradesInput.schema';
import { TranscriptCreateNestedOneWithoutGradesInputObjectSchema } from './TranscriptCreateNestedOneWithoutGradesInput.schema'

export const GradeCreateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.GradeCreateWithoutProfesseurInput, z.ZodTypeDef, Prisma.GradeCreateWithoutProfesseurInput> = z.object({
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
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();
export const GradeCreateWithoutProfesseurInputObjectZodSchema = z.object({
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
  transcript: z.lazy(() => TranscriptCreateNestedOneWithoutGradesInputObjectSchema).optional()
}).strict();

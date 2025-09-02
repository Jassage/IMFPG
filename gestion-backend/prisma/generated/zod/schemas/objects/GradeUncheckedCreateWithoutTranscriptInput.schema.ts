import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema'

export const GradeUncheckedCreateWithoutTranscriptInputObjectSchema: z.ZodType<Prisma.GradeUncheckedCreateWithoutTranscriptInput, z.ZodTypeDef, Prisma.GradeUncheckedCreateWithoutTranscriptInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  ueId: z.string(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  createdAt: z.date().optional(),
  professeurId: z.string().nullish()
}).strict();
export const GradeUncheckedCreateWithoutTranscriptInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  ueId: z.string(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  createdAt: z.date().optional(),
  professeurId: z.string().nullish()
}).strict();

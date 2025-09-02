import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema'

export const GradeUncheckedCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.GradeUncheckedCreateWithoutUeInput, z.ZodTypeDef, Prisma.GradeUncheckedCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  createdAt: z.date().optional(),
  transcriptId: z.string().nullish(),
  professeurId: z.string().nullish()
}).strict();
export const GradeUncheckedCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  grade: z.number(),
  status: GradeStatusSchema,
  session: SessionTypeSchema,
  semester: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  createdAt: z.date().optional(),
  transcriptId: z.string().nullish(),
  professeurId: z.string().nullish()
}).strict();

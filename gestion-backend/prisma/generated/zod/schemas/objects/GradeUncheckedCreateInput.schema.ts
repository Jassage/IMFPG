import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema'

export const GradeUncheckedCreateInputObjectSchema: z.ZodType<Prisma.GradeUncheckedCreateInput, z.ZodTypeDef, Prisma.GradeUncheckedCreateInput> = z.object({
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
  transcriptId: z.string().nullish(),
  professeurId: z.string().nullish()
}).strict();
export const GradeUncheckedCreateInputObjectZodSchema = z.object({
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
  transcriptId: z.string().nullish(),
  professeurId: z.string().nullish()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeCreateWithoutAcademicYearInputObjectSchema } from './GradeCreateWithoutAcademicYearInput.schema';
import { GradeUncheckedCreateWithoutAcademicYearInputObjectSchema } from './GradeUncheckedCreateWithoutAcademicYearInput.schema'

export const GradeCreateOrConnectWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.GradeCreateOrConnectWithoutAcademicYearInput, z.ZodTypeDef, Prisma.GradeCreateOrConnectWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const GradeCreateOrConnectWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();

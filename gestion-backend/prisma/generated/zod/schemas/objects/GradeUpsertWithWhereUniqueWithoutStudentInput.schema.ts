import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutStudentInputObjectSchema } from './GradeUpdateWithoutStudentInput.schema';
import { GradeUncheckedUpdateWithoutStudentInputObjectSchema } from './GradeUncheckedUpdateWithoutStudentInput.schema';
import { GradeCreateWithoutStudentInputObjectSchema } from './GradeCreateWithoutStudentInput.schema';
import { GradeUncheckedCreateWithoutStudentInputObjectSchema } from './GradeUncheckedCreateWithoutStudentInput.schema'

export const GradeUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.GradeUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.GradeUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const GradeUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();

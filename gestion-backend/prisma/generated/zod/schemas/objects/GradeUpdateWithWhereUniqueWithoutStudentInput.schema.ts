import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutStudentInputObjectSchema } from './GradeUpdateWithoutStudentInput.schema';
import { GradeUncheckedUpdateWithoutStudentInputObjectSchema } from './GradeUncheckedUpdateWithoutStudentInput.schema'

export const GradeUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.GradeUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.GradeUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const GradeUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();

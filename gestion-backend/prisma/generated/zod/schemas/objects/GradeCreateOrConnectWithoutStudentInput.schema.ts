import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeCreateWithoutStudentInputObjectSchema } from './GradeCreateWithoutStudentInput.schema';
import { GradeUncheckedCreateWithoutStudentInputObjectSchema } from './GradeUncheckedCreateWithoutStudentInput.schema'

export const GradeCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.GradeCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.GradeCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const GradeCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();

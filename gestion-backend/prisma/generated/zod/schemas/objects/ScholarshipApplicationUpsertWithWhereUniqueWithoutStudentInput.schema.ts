import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationUpdateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUpdateWithoutStudentInput.schema';
import { ScholarshipApplicationUncheckedUpdateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateWithoutStudentInput.schema';
import { ScholarshipApplicationCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationCreateWithoutStudentInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutStudentInput.schema'

export const ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();

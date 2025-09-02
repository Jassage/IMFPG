import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeUpdateWithoutStudentInputObjectSchema } from './RetakeUpdateWithoutStudentInput.schema';
import { RetakeUncheckedUpdateWithoutStudentInputObjectSchema } from './RetakeUncheckedUpdateWithoutStudentInput.schema';
import { RetakeCreateWithoutStudentInputObjectSchema } from './RetakeCreateWithoutStudentInput.schema';
import { RetakeUncheckedCreateWithoutStudentInputObjectSchema } from './RetakeUncheckedCreateWithoutStudentInput.schema'

export const RetakeUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RetakeUpdateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const RetakeUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RetakeUpdateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutUeInputObjectSchema } from './GradeUpdateWithoutUeInput.schema';
import { GradeUncheckedUpdateWithoutUeInputObjectSchema } from './GradeUncheckedUpdateWithoutUeInput.schema';
import { GradeCreateWithoutUeInputObjectSchema } from './GradeCreateWithoutUeInput.schema';
import { GradeUncheckedCreateWithoutUeInputObjectSchema } from './GradeUncheckedCreateWithoutUeInput.schema'

export const GradeUpsertWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.GradeUpsertWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.GradeUpsertWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const GradeUpsertWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();

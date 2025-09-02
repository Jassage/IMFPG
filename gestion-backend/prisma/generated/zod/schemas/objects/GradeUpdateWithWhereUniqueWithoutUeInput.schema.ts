import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutUeInputObjectSchema } from './GradeUpdateWithoutUeInput.schema';
import { GradeUncheckedUpdateWithoutUeInputObjectSchema } from './GradeUncheckedUpdateWithoutUeInput.schema'

export const GradeUpdateWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.GradeUpdateWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.GradeUpdateWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();
export const GradeUpdateWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();

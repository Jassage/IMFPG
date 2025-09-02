import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeCreateWithoutUeInputObjectSchema } from './GradeCreateWithoutUeInput.schema';
import { GradeUncheckedCreateWithoutUeInputObjectSchema } from './GradeUncheckedCreateWithoutUeInput.schema'

export const GradeCreateOrConnectWithoutUeInputObjectSchema: z.ZodType<Prisma.GradeCreateOrConnectWithoutUeInput, z.ZodTypeDef, Prisma.GradeCreateOrConnectWithoutUeInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const GradeCreateOrConnectWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();

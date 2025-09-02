import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutUeInputObjectSchema } from './GradeCreateWithoutUeInput.schema';
import { GradeUncheckedCreateWithoutUeInputObjectSchema } from './GradeUncheckedCreateWithoutUeInput.schema';
import { GradeCreateOrConnectWithoutUeInputObjectSchema } from './GradeCreateOrConnectWithoutUeInput.schema';
import { GradeCreateManyUeInputEnvelopeObjectSchema } from './GradeCreateManyUeInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema'

export const GradeCreateNestedManyWithoutUeInputObjectSchema: z.ZodType<Prisma.GradeCreateNestedManyWithoutUeInput, z.ZodTypeDef, Prisma.GradeCreateNestedManyWithoutUeInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const GradeCreateNestedManyWithoutUeInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();

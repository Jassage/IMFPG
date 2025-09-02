import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutUeInputObjectSchema } from './GradeCreateWithoutUeInput.schema';
import { GradeUncheckedCreateWithoutUeInputObjectSchema } from './GradeUncheckedCreateWithoutUeInput.schema';
import { GradeCreateOrConnectWithoutUeInputObjectSchema } from './GradeCreateOrConnectWithoutUeInput.schema';
import { GradeUpsertWithWhereUniqueWithoutUeInputObjectSchema } from './GradeUpsertWithWhereUniqueWithoutUeInput.schema';
import { GradeCreateManyUeInputEnvelopeObjectSchema } from './GradeCreateManyUeInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithWhereUniqueWithoutUeInputObjectSchema } from './GradeUpdateWithWhereUniqueWithoutUeInput.schema';
import { GradeUpdateManyWithWhereWithoutUeInputObjectSchema } from './GradeUpdateManyWithWhereWithoutUeInput.schema';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema'

export const GradeUncheckedUpdateManyWithoutUeNestedInputObjectSchema: z.ZodType<Prisma.GradeUncheckedUpdateManyWithoutUeNestedInput, z.ZodTypeDef, Prisma.GradeUncheckedUpdateManyWithoutUeNestedInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const GradeUncheckedUpdateManyWithoutUeNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutUeInputObjectSchema), z.lazy(() => GradeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();

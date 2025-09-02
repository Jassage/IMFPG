import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateWithoutScholarshipInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutScholarshipInput.schema';
import { ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateOrConnectWithoutScholarshipInput.schema';
import { ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInput.schema';
import { ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectSchema } from './ScholarshipApplicationCreateManyScholarshipInputEnvelope.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInput.schema';
import { ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInput.schema';
import { ScholarshipApplicationScalarWhereInputObjectSchema } from './ScholarshipApplicationScalarWhereInput.schema'

export const ScholarshipApplicationUpdateManyWithoutScholarshipNestedInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateManyWithoutScholarshipNestedInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateManyWithoutScholarshipNestedInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipApplicationUpdateManyWithoutScholarshipNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutScholarshipInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutScholarshipInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional()
}).strict();

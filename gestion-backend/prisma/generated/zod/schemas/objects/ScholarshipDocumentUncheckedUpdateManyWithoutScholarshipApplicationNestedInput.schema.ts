import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectSchema } from './ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelope.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentScalarWhereInputObjectSchema } from './ScholarshipDocumentScalarWhereInput.schema'

export const ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema).array(), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema).array(), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array()]).optional()
}).strict();

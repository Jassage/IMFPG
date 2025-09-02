import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectSchema } from './ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelope.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './ScholarshipDocumentWhereUniqueInput.schema'

export const ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema).array(), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema).array(), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();

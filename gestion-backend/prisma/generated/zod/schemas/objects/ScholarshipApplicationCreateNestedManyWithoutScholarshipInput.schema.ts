import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateWithoutScholarshipInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutScholarshipInput.schema';
import { ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateOrConnectWithoutScholarshipInput.schema';
import { ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectSchema } from './ScholarshipApplicationCreateManyScholarshipInputEnvelope.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema'

export const ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateNestedManyWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateNestedManyWithoutScholarshipInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipApplicationCreateNestedManyWithoutScholarshipInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();

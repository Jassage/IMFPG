import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationCreateWithoutStudentInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutStudentInput.schema';
import { ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema } from './ScholarshipApplicationCreateOrConnectWithoutStudentInput.schema';
import { ScholarshipApplicationCreateManyStudentInputEnvelopeObjectSchema } from './ScholarshipApplicationCreateManyStudentInputEnvelope.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema'

export const ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();

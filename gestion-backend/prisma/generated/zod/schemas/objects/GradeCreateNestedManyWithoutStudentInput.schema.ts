import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutStudentInputObjectSchema } from './GradeCreateWithoutStudentInput.schema';
import { GradeUncheckedCreateWithoutStudentInputObjectSchema } from './GradeUncheckedCreateWithoutStudentInput.schema';
import { GradeCreateOrConnectWithoutStudentInputObjectSchema } from './GradeCreateOrConnectWithoutStudentInput.schema';
import { GradeCreateManyStudentInputEnvelopeObjectSchema } from './GradeCreateManyStudentInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema'

export const GradeCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.GradeCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.GradeCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const GradeCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();

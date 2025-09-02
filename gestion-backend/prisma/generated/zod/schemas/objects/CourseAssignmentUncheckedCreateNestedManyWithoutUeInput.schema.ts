import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutUeInputObjectSchema } from './CourseAssignmentCreateWithoutUeInput.schema';
import { CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutUeInput.schema';
import { CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutUeInput.schema';
import { CourseAssignmentCreateManyUeInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyUeInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema'

export const CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedCreateNestedManyWithoutUeInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedCreateNestedManyWithoutUeInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();

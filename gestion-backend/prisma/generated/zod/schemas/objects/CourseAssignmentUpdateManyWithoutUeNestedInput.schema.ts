import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutUeInputObjectSchema } from './CourseAssignmentCreateWithoutUeInput.schema';
import { CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutUeInput.schema';
import { CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutUeInput.schema';
import { CourseAssignmentUpsertWithWhereUniqueWithoutUeInputObjectSchema } from './CourseAssignmentUpsertWithWhereUniqueWithoutUeInput.schema';
import { CourseAssignmentCreateManyUeInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyUeInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithWhereUniqueWithoutUeInputObjectSchema } from './CourseAssignmentUpdateWithWhereUniqueWithoutUeInput.schema';
import { CourseAssignmentUpdateManyWithWhereWithoutUeInputObjectSchema } from './CourseAssignmentUpdateManyWithWhereWithoutUeInput.schema';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema'

export const CourseAssignmentUpdateManyWithoutUeNestedInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateManyWithoutUeNestedInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateManyWithoutUeNestedInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentUpdateManyWithoutUeNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();

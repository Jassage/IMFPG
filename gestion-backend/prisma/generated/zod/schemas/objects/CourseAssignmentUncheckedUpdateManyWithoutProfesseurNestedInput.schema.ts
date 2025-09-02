import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateWithoutProfesseurInput.schema';
import { CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutProfesseurInput.schema';
import { CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutProfesseurInput.schema';
import { CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema } from './CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInput.schema';
import { CourseAssignmentCreateManyProfesseurInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyProfesseurInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema } from './CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInput.schema';
import { CourseAssignmentUpdateManyWithWhereWithoutProfesseurInputObjectSchema } from './CourseAssignmentUpdateManyWithWhereWithoutProfesseurInput.schema';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema'

export const CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutProfesseurInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutProfesseurInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();

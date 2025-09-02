import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateWithoutProfesseurInput.schema';
import { CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutProfesseurInput.schema';
import { CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutProfesseurInput.schema';
import { CourseAssignmentCreateManyProfesseurInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyProfesseurInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema'

export const CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();

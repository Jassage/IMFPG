import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateWithoutProfesseurInput.schema';
import { CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutProfesseurInput.schema'

export const CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateOrConnectWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateOrConnectWithoutProfesseurInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
export const CourseAssignmentCreateOrConnectWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();

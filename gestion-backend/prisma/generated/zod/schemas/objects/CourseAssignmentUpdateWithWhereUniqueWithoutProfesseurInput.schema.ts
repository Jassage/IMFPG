import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUpdateWithoutProfesseurInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutProfesseurInput.schema'

export const CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateWithWhereUniqueWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();

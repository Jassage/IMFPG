import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUpdateWithoutProfesseurInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutProfesseurInput.schema';
import { CourseAssignmentCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateWithoutProfesseurInput.schema';
import { CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutProfesseurInput.schema'

export const CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
export const CourseAssignmentUpsertWithWhereUniqueWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();

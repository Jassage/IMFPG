import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInput.schema';
import { ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedCreateNestedManyWithoutProfesseurInput.schema'

export const ProfesseurUncheckedCreateWithoutGradesInputObjectSchema: z.ZodType<Prisma.ProfesseurUncheckedCreateWithoutGradesInput, z.ZodTypeDef, Prisma.ProfesseurUncheckedCreateWithoutGradesInput> = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  department: z.string().nullish(),
  office: z.string().nullish(),
  hireDate: z.date().nullish(),
  status: UserStatusSchema.optional(),
  speciality: z.string().nullish(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();
export const ProfesseurUncheckedCreateWithoutGradesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  department: z.string().nullish(),
  office: z.string().nullish(),
  hireDate: z.date().nullish(),
  status: UserStatusSchema.optional(),
  speciality: z.string().nullish(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();

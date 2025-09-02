import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { UserCreateNestedOneWithoutProfesseurInputObjectSchema } from './UserCreateNestedOneWithoutProfesseurInput.schema';
import { CourseAssignmentCreateNestedManyWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutProfesseurInput.schema';
import { ScheduleCreateNestedManyWithoutProfesseurInputObjectSchema } from './ScheduleCreateNestedManyWithoutProfesseurInput.schema'

export const ProfesseurCreateWithoutGradesInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateWithoutGradesInput, z.ZodTypeDef, Prisma.ProfesseurCreateWithoutGradesInput> = z.object({
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
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutProfesseurInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();
export const ProfesseurCreateWithoutGradesInputObjectZodSchema = z.object({
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
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutProfesseurInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { CourseAssignmentCreateNestedManyWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutProfesseurInput.schema';
import { ScheduleCreateNestedManyWithoutProfesseurInputObjectSchema } from './ScheduleCreateNestedManyWithoutProfesseurInput.schema';
import { GradeCreateNestedManyWithoutProfesseurInputObjectSchema } from './GradeCreateNestedManyWithoutProfesseurInput.schema'

export const ProfesseurCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateWithoutUserInput, z.ZodTypeDef, Prisma.ProfesseurCreateWithoutUserInput> = z.object({
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
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();
export const ProfesseurCreateWithoutUserInputObjectZodSchema = z.object({
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
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();

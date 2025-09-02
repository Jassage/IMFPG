import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { UserCreateNestedOneWithoutProfesseurInputObjectSchema } from './UserCreateNestedOneWithoutProfesseurInput.schema';
import { CourseAssignmentCreateNestedManyWithoutProfesseurInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutProfesseurInput.schema';
import { GradeCreateNestedManyWithoutProfesseurInputObjectSchema } from './GradeCreateNestedManyWithoutProfesseurInput.schema'

export const ProfesseurCreateWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateWithoutSchedulesInput, z.ZodTypeDef, Prisma.ProfesseurCreateWithoutSchedulesInput> = z.object({
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
  grades: z.lazy(() => GradeCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();
export const ProfesseurCreateWithoutSchedulesInputObjectZodSchema = z.object({
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
  grades: z.lazy(() => GradeCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();

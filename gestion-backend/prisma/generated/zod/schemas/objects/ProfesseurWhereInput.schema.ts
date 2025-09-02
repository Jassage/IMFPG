import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EnumUserStatusFilterObjectSchema } from './EnumUserStatusFilter.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { CourseAssignmentListRelationFilterObjectSchema } from './CourseAssignmentListRelationFilter.schema';
import { ScheduleListRelationFilterObjectSchema } from './ScheduleListRelationFilter.schema';
import { GradeListRelationFilterObjectSchema } from './GradeListRelationFilter.schema'

export const ProfesseurWhereInputObjectSchema: z.ZodType<Prisma.ProfesseurWhereInput, z.ZodTypeDef, Prisma.ProfesseurWhereInput> = z.object({
  AND: z.union([z.lazy(() => ProfesseurWhereInputObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProfesseurWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProfesseurWhereInputObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema).array()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  department: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  office: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  hireDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => EnumUserStatusFilterObjectSchema), UserStatusSchema]).optional(),
  speciality: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  userId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  user: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).nullish(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleListRelationFilterObjectSchema).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional()
}).strict();
export const ProfesseurWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ProfesseurWhereInputObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProfesseurWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProfesseurWhereInputObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema).array()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  department: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  office: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  hireDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  status: z.union([z.lazy(() => EnumUserStatusFilterObjectSchema), UserStatusSchema]).optional(),
  speciality: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  userId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  user: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).nullish(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleListRelationFilterObjectSchema).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { CourseAssignmentScalarRelationFilterObjectSchema } from './CourseAssignmentScalarRelationFilter.schema';
import { CourseAssignmentWhereInputObjectSchema } from './CourseAssignmentWhereInput.schema';
import { ProfesseurNullableScalarRelationFilterObjectSchema } from './ProfesseurNullableScalarRelationFilter.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { AttendanceListRelationFilterObjectSchema } from './AttendanceListRelationFilter.schema'

export const ScheduleWhereInputObjectSchema: z.ZodType<Prisma.ScheduleWhereInput, z.ZodTypeDef, Prisma.ScheduleWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScheduleWhereInputObjectSchema), z.lazy(() => ScheduleWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScheduleWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScheduleWhereInputObjectSchema), z.lazy(() => ScheduleWhereInputObjectSchema).array()]).optional(),
  assignmentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  dayOfWeek: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  startTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  endTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  classroom: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  recurrence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  exceptions: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  assignment: z.union([z.lazy(() => CourseAssignmentScalarRelationFilterObjectSchema), z.lazy(() => CourseAssignmentWhereInputObjectSchema)]).optional(),
  professeur: z.union([z.lazy(() => ProfesseurNullableScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).nullish(),
  attendances: z.lazy(() => AttendanceListRelationFilterObjectSchema).optional()
}).strict();
export const ScheduleWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScheduleWhereInputObjectSchema), z.lazy(() => ScheduleWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScheduleWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScheduleWhereInputObjectSchema), z.lazy(() => ScheduleWhereInputObjectSchema).array()]).optional(),
  assignmentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  dayOfWeek: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  startTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  endTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  classroom: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  recurrence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  exceptions: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  assignment: z.union([z.lazy(() => CourseAssignmentScalarRelationFilterObjectSchema), z.lazy(() => CourseAssignmentWhereInputObjectSchema)]).optional(),
  professeur: z.union([z.lazy(() => ProfesseurNullableScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).nullish(),
  attendances: z.lazy(() => AttendanceListRelationFilterObjectSchema).optional()
}).strict();

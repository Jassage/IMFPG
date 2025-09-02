import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { EnumSemesterFilterObjectSchema } from './EnumSemesterFilter.schema';
import { SemesterSchema } from '../enums/Semester.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UEScalarRelationFilterObjectSchema } from './UEScalarRelationFilter.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema';
import { FacultyScalarRelationFilterObjectSchema } from './FacultyScalarRelationFilter.schema';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema';
import { ProfesseurScalarRelationFilterObjectSchema } from './ProfesseurScalarRelationFilter.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { AcademicYearScalarRelationFilterObjectSchema } from './AcademicYearScalarRelationFilter.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { FacultyLevelNullableScalarRelationFilterObjectSchema } from './FacultyLevelNullableScalarRelationFilter.schema';
import { FacultyLevelWhereInputObjectSchema } from './FacultyLevelWhereInput.schema';
import { ScheduleListRelationFilterObjectSchema } from './ScheduleListRelationFilter.schema'

export const CourseAssignmentWhereInputObjectSchema: z.ZodType<Prisma.CourseAssignmentWhereInput, z.ZodTypeDef, Prisma.CourseAssignmentWhereInput> = z.object({
  AND: z.union([z.lazy(() => CourseAssignmentWhereInputObjectSchema), z.lazy(() => CourseAssignmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CourseAssignmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CourseAssignmentWhereInputObjectSchema), z.lazy(() => CourseAssignmentWhereInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  professeurId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => EnumSemesterFilterObjectSchema), SemesterSchema]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyLevelId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional(),
  faculty: z.union([z.lazy(() => FacultyScalarRelationFilterObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema)]).optional(),
  professeur: z.union([z.lazy(() => ProfesseurScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional(),
  facultyLevel: z.union([z.lazy(() => FacultyLevelNullableScalarRelationFilterObjectSchema), z.lazy(() => FacultyLevelWhereInputObjectSchema)]).nullish(),
  schedules: z.lazy(() => ScheduleListRelationFilterObjectSchema).optional()
}).strict();
export const CourseAssignmentWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => CourseAssignmentWhereInputObjectSchema), z.lazy(() => CourseAssignmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CourseAssignmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CourseAssignmentWhereInputObjectSchema), z.lazy(() => CourseAssignmentWhereInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  professeurId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  semester: z.union([z.lazy(() => EnumSemesterFilterObjectSchema), SemesterSchema]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyLevelId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional(),
  faculty: z.union([z.lazy(() => FacultyScalarRelationFilterObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema)]).optional(),
  professeur: z.union([z.lazy(() => ProfesseurScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional(),
  facultyLevel: z.union([z.lazy(() => FacultyLevelNullableScalarRelationFilterObjectSchema), z.lazy(() => FacultyLevelWhereInputObjectSchema)]).nullish(),
  schedules: z.lazy(() => ScheduleListRelationFilterObjectSchema).optional()
}).strict();

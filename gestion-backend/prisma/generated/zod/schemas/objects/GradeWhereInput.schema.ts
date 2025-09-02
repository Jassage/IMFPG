import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { EnumGradeStatusFilterObjectSchema } from './EnumGradeStatusFilter.schema';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { EnumSessionTypeFilterObjectSchema } from './EnumSessionTypeFilter.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { UEScalarRelationFilterObjectSchema } from './UEScalarRelationFilter.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema';
import { AcademicYearScalarRelationFilterObjectSchema } from './AcademicYearScalarRelationFilter.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { TranscriptNullableScalarRelationFilterObjectSchema } from './TranscriptNullableScalarRelationFilter.schema';
import { TranscriptWhereInputObjectSchema } from './TranscriptWhereInput.schema';
import { ProfesseurNullableScalarRelationFilterObjectSchema } from './ProfesseurNullableScalarRelationFilter.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema'

export const GradeWhereInputObjectSchema: z.ZodType<Prisma.GradeWhereInput, z.ZodTypeDef, Prisma.GradeWhereInput> = z.object({
  AND: z.union([z.lazy(() => GradeWhereInputObjectSchema), z.lazy(() => GradeWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GradeWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GradeWhereInputObjectSchema), z.lazy(() => GradeWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  grade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  status: z.union([z.lazy(() => EnumGradeStatusFilterObjectSchema), GradeStatusSchema]).optional(),
  session: z.union([z.lazy(() => EnumSessionTypeFilterObjectSchema), SessionTypeSchema]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  transcriptId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional(),
  transcript: z.union([z.lazy(() => TranscriptNullableScalarRelationFilterObjectSchema), z.lazy(() => TranscriptWhereInputObjectSchema)]).nullish(),
  professeur: z.union([z.lazy(() => ProfesseurNullableScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).nullish()
}).strict();
export const GradeWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => GradeWhereInputObjectSchema), z.lazy(() => GradeWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GradeWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GradeWhereInputObjectSchema), z.lazy(() => GradeWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  grade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  status: z.union([z.lazy(() => EnumGradeStatusFilterObjectSchema), GradeStatusSchema]).optional(),
  session: z.union([z.lazy(() => EnumSessionTypeFilterObjectSchema), SessionTypeSchema]).optional(),
  semester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  transcriptId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional(),
  transcript: z.union([z.lazy(() => TranscriptNullableScalarRelationFilterObjectSchema), z.lazy(() => TranscriptWhereInputObjectSchema)]).nullish(),
  professeur: z.union([z.lazy(() => ProfesseurNullableScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).nullish()
}).strict();

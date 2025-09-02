import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumUserRoleFilterObjectSchema } from './EnumUserRoleFilter.schema';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { EnumUserStatusFilterObjectSchema } from './EnumUserStatusFilter.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { StudentNullableScalarRelationFilterObjectSchema } from './StudentNullableScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { ProfesseurNullableScalarRelationFilterObjectSchema } from './ProfesseurNullableScalarRelationFilter.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { UEListRelationFilterObjectSchema } from './UEListRelationFilter.schema'

export const UserWhereInputObjectSchema: z.ZodType<Prisma.UserWhereInput, z.ZodTypeDef, Prisma.UserWhereInput> = z.object({
  AND: z.union([z.lazy(() => UserWhereInputObjectSchema), z.lazy(() => UserWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UserWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserWhereInputObjectSchema), z.lazy(() => UserWhereInputObjectSchema).array()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  role: z.union([z.lazy(() => EnumUserRoleFilterObjectSchema), UserRoleSchema]).optional(),
  status: z.union([z.lazy(() => EnumUserStatusFilterObjectSchema), UserStatusSchema]).optional(),
  lastLogin: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  avatar: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  password: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  student: z.union([z.lazy(() => StudentNullableScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).nullish(),
  professeur: z.union([z.lazy(() => ProfesseurNullableScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).nullish(),
  createdUEs: z.lazy(() => UEListRelationFilterObjectSchema).optional()
}).strict();
export const UserWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => UserWhereInputObjectSchema), z.lazy(() => UserWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UserWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserWhereInputObjectSchema), z.lazy(() => UserWhereInputObjectSchema).array()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  role: z.union([z.lazy(() => EnumUserRoleFilterObjectSchema), UserRoleSchema]).optional(),
  status: z.union([z.lazy(() => EnumUserStatusFilterObjectSchema), UserStatusSchema]).optional(),
  lastLogin: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  avatar: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  password: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  student: z.union([z.lazy(() => StudentNullableScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).nullish(),
  professeur: z.union([z.lazy(() => ProfesseurNullableScalarRelationFilterObjectSchema), z.lazy(() => ProfesseurWhereInputObjectSchema)]).nullish(),
  createdUEs: z.lazy(() => UEListRelationFilterObjectSchema).optional()
}).strict();

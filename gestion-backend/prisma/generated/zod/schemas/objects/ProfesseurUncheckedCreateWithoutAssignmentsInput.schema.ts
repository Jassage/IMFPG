import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedCreateNestedManyWithoutProfesseurInput.schema';
import { GradeUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutProfesseurInput.schema'

export const ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.ProfesseurUncheckedCreateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.ProfesseurUncheckedCreateWithoutAssignmentsInput> = z.object({
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
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();
export const ProfesseurUncheckedCreateWithoutAssignmentsInputObjectZodSchema = z.object({
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
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema).optional()
}).strict();

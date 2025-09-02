import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateNestedOneWithoutLevelsInputObjectSchema } from './FacultyCreateNestedOneWithoutLevelsInput.schema'

export const FacultyLevelCreateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyLevelCreateWithoutAssignmentsInput> = z.object({
  id: z.string().optional(),
  level: z.string().max(10),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutLevelsInputObjectSchema)
}).strict();
export const FacultyLevelCreateWithoutAssignmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string().max(10),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutLevelsInputObjectSchema)
}).strict();

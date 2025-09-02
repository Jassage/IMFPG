import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedCreateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedCreateWithoutAssignmentsInput> = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string()
}).strict();
export const FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string()
}).strict();

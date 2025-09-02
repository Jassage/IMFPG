import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelFacultyIdLevelCompoundUniqueInputObjectSchema: z.ZodType<Prisma.FacultyLevelFacultyIdLevelCompoundUniqueInput, z.ZodTypeDef, Prisma.FacultyLevelFacultyIdLevelCompoundUniqueInput> = z.object({
  facultyId: z.string(),
  level: z.string()
}).strict();
export const FacultyLevelFacultyIdLevelCompoundUniqueInputObjectZodSchema = z.object({
  facultyId: z.string(),
  level: z.string()
}).strict();

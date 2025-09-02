import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelFacultyIdLevelCompoundUniqueInputObjectSchema } from './FacultyLevelFacultyIdLevelCompoundUniqueInput.schema'

export const FacultyLevelWhereUniqueInputObjectSchema: z.ZodType<Prisma.FacultyLevelWhereUniqueInput, z.ZodTypeDef, Prisma.FacultyLevelWhereUniqueInput> = z.object({
  id: z.string(),
  facultyId_level: z.lazy(() => FacultyLevelFacultyIdLevelCompoundUniqueInputObjectSchema)
}).strict();
export const FacultyLevelWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  facultyId_level: z.lazy(() => FacultyLevelFacultyIdLevelCompoundUniqueInputObjectSchema)
}).strict();

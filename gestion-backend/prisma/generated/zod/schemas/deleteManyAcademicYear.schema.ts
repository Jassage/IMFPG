import { z } from 'zod';
import { AcademicYearWhereInputObjectSchema } from './objects/AcademicYearWhereInput.schema';

export const AcademicYearDeleteManySchema = z.object({ where: AcademicYearWhereInputObjectSchema.optional()  })
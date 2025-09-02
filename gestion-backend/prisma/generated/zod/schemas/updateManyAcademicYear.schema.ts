import { z } from 'zod';
import { AcademicYearUpdateManyMutationInputObjectSchema } from './objects/AcademicYearUpdateManyMutationInput.schema';
import { AcademicYearWhereInputObjectSchema } from './objects/AcademicYearWhereInput.schema';

export const AcademicYearUpdateManySchema = z.object({ data: AcademicYearUpdateManyMutationInputObjectSchema, where: AcademicYearWhereInputObjectSchema.optional()  })
import { z } from 'zod';
import { AcademicYearSelectObjectSchema } from './objects/AcademicYearSelect.schema';
import { AcademicYearUpdateManyMutationInputObjectSchema } from './objects/AcademicYearUpdateManyMutationInput.schema';
import { AcademicYearWhereInputObjectSchema } from './objects/AcademicYearWhereInput.schema';

export const AcademicYearUpdateManyAndReturnSchema = z.object({ select: AcademicYearSelectObjectSchema.optional(), data: AcademicYearUpdateManyMutationInputObjectSchema, where: AcademicYearWhereInputObjectSchema.optional()  }).strict()
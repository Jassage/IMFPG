import { z } from 'zod';
import { AcademicYearSelectObjectSchema } from './objects/AcademicYearSelect.schema';
import { AcademicYearCreateManyInputObjectSchema } from './objects/AcademicYearCreateManyInput.schema';

export const AcademicYearCreateManyAndReturnSchema = z.object({ select: AcademicYearSelectObjectSchema.optional(), data: z.union([ AcademicYearCreateManyInputObjectSchema, z.array(AcademicYearCreateManyInputObjectSchema) ]),  }).strict()
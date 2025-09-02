import { z } from 'zod';
import { AcademicYearCreateManyInputObjectSchema } from './objects/AcademicYearCreateManyInput.schema';

export const AcademicYearCreateManySchema = z.object({ data: z.union([ AcademicYearCreateManyInputObjectSchema, z.array(AcademicYearCreateManyInputObjectSchema) ]),  })
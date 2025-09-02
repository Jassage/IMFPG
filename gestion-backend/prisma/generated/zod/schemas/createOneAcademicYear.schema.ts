import { z } from 'zod';
import { AcademicYearSelectObjectSchema } from './objects/AcademicYearSelect.schema';
import { AcademicYearIncludeObjectSchema } from './objects/AcademicYearInclude.schema';
import { AcademicYearCreateInputObjectSchema } from './objects/AcademicYearCreateInput.schema';
import { AcademicYearUncheckedCreateInputObjectSchema } from './objects/AcademicYearUncheckedCreateInput.schema';

export const AcademicYearCreateOneSchema = z.object({ select: AcademicYearSelectObjectSchema.optional(), include: AcademicYearIncludeObjectSchema.optional(), data: z.union([AcademicYearCreateInputObjectSchema, AcademicYearUncheckedCreateInputObjectSchema])  })
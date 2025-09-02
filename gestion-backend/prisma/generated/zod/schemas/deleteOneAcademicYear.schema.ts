import { z } from 'zod';
import { AcademicYearSelectObjectSchema } from './objects/AcademicYearSelect.schema';
import { AcademicYearIncludeObjectSchema } from './objects/AcademicYearInclude.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './objects/AcademicYearWhereUniqueInput.schema';

export const AcademicYearDeleteOneSchema = z.object({ select: AcademicYearSelectObjectSchema.optional(), include: AcademicYearIncludeObjectSchema.optional(), where: AcademicYearWhereUniqueInputObjectSchema  })
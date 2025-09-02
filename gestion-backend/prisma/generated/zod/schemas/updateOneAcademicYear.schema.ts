import { z } from 'zod';
import { AcademicYearSelectObjectSchema } from './objects/AcademicYearSelect.schema';
import { AcademicYearIncludeObjectSchema } from './objects/AcademicYearInclude.schema';
import { AcademicYearUpdateInputObjectSchema } from './objects/AcademicYearUpdateInput.schema';
import { AcademicYearUncheckedUpdateInputObjectSchema } from './objects/AcademicYearUncheckedUpdateInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './objects/AcademicYearWhereUniqueInput.schema';

export const AcademicYearUpdateOneSchema = z.object({ select: AcademicYearSelectObjectSchema.optional(), include: AcademicYearIncludeObjectSchema.optional(), data: z.union([AcademicYearUpdateInputObjectSchema, AcademicYearUncheckedUpdateInputObjectSchema]), where: AcademicYearWhereUniqueInputObjectSchema  })
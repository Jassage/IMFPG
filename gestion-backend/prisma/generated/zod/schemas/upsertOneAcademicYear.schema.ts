import { z } from 'zod';
import { AcademicYearSelectObjectSchema } from './objects/AcademicYearSelect.schema';
import { AcademicYearIncludeObjectSchema } from './objects/AcademicYearInclude.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './objects/AcademicYearWhereUniqueInput.schema';
import { AcademicYearCreateInputObjectSchema } from './objects/AcademicYearCreateInput.schema';
import { AcademicYearUncheckedCreateInputObjectSchema } from './objects/AcademicYearUncheckedCreateInput.schema';
import { AcademicYearUpdateInputObjectSchema } from './objects/AcademicYearUpdateInput.schema';
import { AcademicYearUncheckedUpdateInputObjectSchema } from './objects/AcademicYearUncheckedUpdateInput.schema';

export const AcademicYearUpsertSchema = z.object({ select: AcademicYearSelectObjectSchema.optional(), include: AcademicYearIncludeObjectSchema.optional(), where: AcademicYearWhereUniqueInputObjectSchema, create: z.union([ AcademicYearCreateInputObjectSchema, AcademicYearUncheckedCreateInputObjectSchema ]), update: z.union([ AcademicYearUpdateInputObjectSchema, AcademicYearUncheckedUpdateInputObjectSchema ])  })
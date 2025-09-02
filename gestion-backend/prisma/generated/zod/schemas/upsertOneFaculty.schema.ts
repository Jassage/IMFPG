import { z } from 'zod';
import { FacultySelectObjectSchema } from './objects/FacultySelect.schema';
import { FacultyIncludeObjectSchema } from './objects/FacultyInclude.schema';
import { FacultyWhereUniqueInputObjectSchema } from './objects/FacultyWhereUniqueInput.schema';
import { FacultyCreateInputObjectSchema } from './objects/FacultyCreateInput.schema';
import { FacultyUncheckedCreateInputObjectSchema } from './objects/FacultyUncheckedCreateInput.schema';
import { FacultyUpdateInputObjectSchema } from './objects/FacultyUpdateInput.schema';
import { FacultyUncheckedUpdateInputObjectSchema } from './objects/FacultyUncheckedUpdateInput.schema';

export const FacultyUpsertSchema = z.object({ select: FacultySelectObjectSchema.optional(), include: FacultyIncludeObjectSchema.optional(), where: FacultyWhereUniqueInputObjectSchema, create: z.union([ FacultyCreateInputObjectSchema, FacultyUncheckedCreateInputObjectSchema ]), update: z.union([ FacultyUpdateInputObjectSchema, FacultyUncheckedUpdateInputObjectSchema ])  })
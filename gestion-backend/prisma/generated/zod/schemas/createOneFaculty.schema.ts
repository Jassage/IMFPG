import { z } from 'zod';
import { FacultySelectObjectSchema } from './objects/FacultySelect.schema';
import { FacultyIncludeObjectSchema } from './objects/FacultyInclude.schema';
import { FacultyCreateInputObjectSchema } from './objects/FacultyCreateInput.schema';
import { FacultyUncheckedCreateInputObjectSchema } from './objects/FacultyUncheckedCreateInput.schema';

export const FacultyCreateOneSchema = z.object({ select: FacultySelectObjectSchema.optional(), include: FacultyIncludeObjectSchema.optional(), data: z.union([FacultyCreateInputObjectSchema, FacultyUncheckedCreateInputObjectSchema])  })
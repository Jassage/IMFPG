import { z } from 'zod';
import { FacultySelectObjectSchema } from './objects/FacultySelect.schema';
import { FacultyIncludeObjectSchema } from './objects/FacultyInclude.schema';
import { FacultyUpdateInputObjectSchema } from './objects/FacultyUpdateInput.schema';
import { FacultyUncheckedUpdateInputObjectSchema } from './objects/FacultyUncheckedUpdateInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './objects/FacultyWhereUniqueInput.schema';

export const FacultyUpdateOneSchema = z.object({ select: FacultySelectObjectSchema.optional(), include: FacultyIncludeObjectSchema.optional(), data: z.union([FacultyUpdateInputObjectSchema, FacultyUncheckedUpdateInputObjectSchema]), where: FacultyWhereUniqueInputObjectSchema  })
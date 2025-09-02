import { z } from 'zod';
import { StudentSelectObjectSchema } from './objects/StudentSelect.schema';
import { StudentIncludeObjectSchema } from './objects/StudentInclude.schema';
import { StudentCreateInputObjectSchema } from './objects/StudentCreateInput.schema';
import { StudentUncheckedCreateInputObjectSchema } from './objects/StudentUncheckedCreateInput.schema';

export const StudentCreateOneSchema = z.object({ select: StudentSelectObjectSchema.optional(), include: StudentIncludeObjectSchema.optional(), data: z.union([StudentCreateInputObjectSchema, StudentUncheckedCreateInputObjectSchema])  })
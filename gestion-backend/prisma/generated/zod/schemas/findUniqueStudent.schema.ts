import { z } from 'zod';
import { StudentSelectObjectSchema } from './objects/StudentSelect.schema';
import { StudentIncludeObjectSchema } from './objects/StudentInclude.schema';
import { StudentWhereUniqueInputObjectSchema } from './objects/StudentWhereUniqueInput.schema';

export const StudentFindUniqueSchema = z.object({ select: StudentSelectObjectSchema.optional(), include: StudentIncludeObjectSchema.optional(), where: StudentWhereUniqueInputObjectSchema })
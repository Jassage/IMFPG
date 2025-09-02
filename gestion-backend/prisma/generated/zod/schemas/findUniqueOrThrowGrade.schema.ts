import { z } from 'zod';
import { GradeSelectObjectSchema } from './objects/GradeSelect.schema';
import { GradeIncludeObjectSchema } from './objects/GradeInclude.schema';
import { GradeWhereUniqueInputObjectSchema } from './objects/GradeWhereUniqueInput.schema';

export const GradeFindUniqueOrThrowSchema = z.object({ select: GradeSelectObjectSchema.optional(), include: GradeIncludeObjectSchema.optional(), where: GradeWhereUniqueInputObjectSchema })
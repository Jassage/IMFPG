import { z } from 'zod';
import { AttendanceSelectObjectSchema } from './objects/AttendanceSelect.schema';
import { AttendanceIncludeObjectSchema } from './objects/AttendanceInclude.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './objects/AttendanceWhereUniqueInput.schema';

export const AttendanceFindUniqueSchema = z.object({ select: AttendanceSelectObjectSchema.optional(), include: AttendanceIncludeObjectSchema.optional(), where: AttendanceWhereUniqueInputObjectSchema })
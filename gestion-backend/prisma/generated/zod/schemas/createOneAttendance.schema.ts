import { z } from 'zod';
import { AttendanceSelectObjectSchema } from './objects/AttendanceSelect.schema';
import { AttendanceIncludeObjectSchema } from './objects/AttendanceInclude.schema';
import { AttendanceCreateInputObjectSchema } from './objects/AttendanceCreateInput.schema';
import { AttendanceUncheckedCreateInputObjectSchema } from './objects/AttendanceUncheckedCreateInput.schema';

export const AttendanceCreateOneSchema = z.object({ select: AttendanceSelectObjectSchema.optional(), include: AttendanceIncludeObjectSchema.optional(), data: z.union([AttendanceCreateInputObjectSchema, AttendanceUncheckedCreateInputObjectSchema])  })
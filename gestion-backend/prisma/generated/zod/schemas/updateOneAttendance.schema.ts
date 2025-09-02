import { z } from 'zod';
import { AttendanceSelectObjectSchema } from './objects/AttendanceSelect.schema';
import { AttendanceIncludeObjectSchema } from './objects/AttendanceInclude.schema';
import { AttendanceUpdateInputObjectSchema } from './objects/AttendanceUpdateInput.schema';
import { AttendanceUncheckedUpdateInputObjectSchema } from './objects/AttendanceUncheckedUpdateInput.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './objects/AttendanceWhereUniqueInput.schema';

export const AttendanceUpdateOneSchema = z.object({ select: AttendanceSelectObjectSchema.optional(), include: AttendanceIncludeObjectSchema.optional(), data: z.union([AttendanceUpdateInputObjectSchema, AttendanceUncheckedUpdateInputObjectSchema]), where: AttendanceWhereUniqueInputObjectSchema  })
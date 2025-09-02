import { z } from 'zod';
import { AttendanceSelectObjectSchema } from './objects/AttendanceSelect.schema';
import { AttendanceIncludeObjectSchema } from './objects/AttendanceInclude.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './objects/AttendanceWhereUniqueInput.schema';
import { AttendanceCreateInputObjectSchema } from './objects/AttendanceCreateInput.schema';
import { AttendanceUncheckedCreateInputObjectSchema } from './objects/AttendanceUncheckedCreateInput.schema';
import { AttendanceUpdateInputObjectSchema } from './objects/AttendanceUpdateInput.schema';
import { AttendanceUncheckedUpdateInputObjectSchema } from './objects/AttendanceUncheckedUpdateInput.schema';

export const AttendanceUpsertSchema = z.object({ select: AttendanceSelectObjectSchema.optional(), include: AttendanceIncludeObjectSchema.optional(), where: AttendanceWhereUniqueInputObjectSchema, create: z.union([ AttendanceCreateInputObjectSchema, AttendanceUncheckedCreateInputObjectSchema ]), update: z.union([ AttendanceUpdateInputObjectSchema, AttendanceUncheckedUpdateInputObjectSchema ])  })
import { z } from 'zod';
import { AttendanceSelectObjectSchema } from './objects/AttendanceSelect.schema';
import { AttendanceCreateManyInputObjectSchema } from './objects/AttendanceCreateManyInput.schema';

export const AttendanceCreateManyAndReturnSchema = z.object({ select: AttendanceSelectObjectSchema.optional(), data: z.union([ AttendanceCreateManyInputObjectSchema, z.array(AttendanceCreateManyInputObjectSchema) ]),  }).strict()
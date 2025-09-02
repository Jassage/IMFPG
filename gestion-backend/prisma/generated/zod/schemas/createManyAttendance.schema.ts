import { z } from 'zod';
import { AttendanceCreateManyInputObjectSchema } from './objects/AttendanceCreateManyInput.schema';

export const AttendanceCreateManySchema = z.object({ data: z.union([ AttendanceCreateManyInputObjectSchema, z.array(AttendanceCreateManyInputObjectSchema) ]),  })
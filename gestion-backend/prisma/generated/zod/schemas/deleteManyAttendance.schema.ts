import { z } from 'zod';
import { AttendanceWhereInputObjectSchema } from './objects/AttendanceWhereInput.schema';

export const AttendanceDeleteManySchema = z.object({ where: AttendanceWhereInputObjectSchema.optional()  })
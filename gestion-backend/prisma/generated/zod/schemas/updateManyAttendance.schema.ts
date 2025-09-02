import { z } from 'zod';
import { AttendanceUpdateManyMutationInputObjectSchema } from './objects/AttendanceUpdateManyMutationInput.schema';
import { AttendanceWhereInputObjectSchema } from './objects/AttendanceWhereInput.schema';

export const AttendanceUpdateManySchema = z.object({ data: AttendanceUpdateManyMutationInputObjectSchema, where: AttendanceWhereInputObjectSchema.optional()  })
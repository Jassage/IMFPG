import { z } from 'zod';
import { AttendanceSelectObjectSchema } from './objects/AttendanceSelect.schema';
import { AttendanceUpdateManyMutationInputObjectSchema } from './objects/AttendanceUpdateManyMutationInput.schema';
import { AttendanceWhereInputObjectSchema } from './objects/AttendanceWhereInput.schema';

export const AttendanceUpdateManyAndReturnSchema = z.object({ select: AttendanceSelectObjectSchema.optional(), data: AttendanceUpdateManyMutationInputObjectSchema, where: AttendanceWhereInputObjectSchema.optional()  }).strict()
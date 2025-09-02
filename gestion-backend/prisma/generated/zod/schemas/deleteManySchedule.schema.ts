import { z } from 'zod';
import { ScheduleWhereInputObjectSchema } from './objects/ScheduleWhereInput.schema';

export const ScheduleDeleteManySchema = z.object({ where: ScheduleWhereInputObjectSchema.optional()  })
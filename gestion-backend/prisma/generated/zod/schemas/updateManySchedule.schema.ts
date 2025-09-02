import { z } from 'zod';
import { ScheduleUpdateManyMutationInputObjectSchema } from './objects/ScheduleUpdateManyMutationInput.schema';
import { ScheduleWhereInputObjectSchema } from './objects/ScheduleWhereInput.schema';

export const ScheduleUpdateManySchema = z.object({ data: ScheduleUpdateManyMutationInputObjectSchema, where: ScheduleWhereInputObjectSchema.optional()  })
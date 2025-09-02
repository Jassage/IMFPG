import { z } from 'zod';
import { ScheduleCreateManyInputObjectSchema } from './objects/ScheduleCreateManyInput.schema';

export const ScheduleCreateManySchema = z.object({ data: z.union([ ScheduleCreateManyInputObjectSchema, z.array(ScheduleCreateManyInputObjectSchema) ]),  })
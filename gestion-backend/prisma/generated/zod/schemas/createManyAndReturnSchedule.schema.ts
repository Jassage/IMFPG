import { z } from 'zod';
import { ScheduleSelectObjectSchema } from './objects/ScheduleSelect.schema';
import { ScheduleCreateManyInputObjectSchema } from './objects/ScheduleCreateManyInput.schema';

export const ScheduleCreateManyAndReturnSchema = z.object({ select: ScheduleSelectObjectSchema.optional(), data: z.union([ ScheduleCreateManyInputObjectSchema, z.array(ScheduleCreateManyInputObjectSchema) ]),  }).strict()
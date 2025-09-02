import { z } from 'zod';
import { ScheduleSelectObjectSchema } from './objects/ScheduleSelect.schema';
import { ScheduleUpdateManyMutationInputObjectSchema } from './objects/ScheduleUpdateManyMutationInput.schema';
import { ScheduleWhereInputObjectSchema } from './objects/ScheduleWhereInput.schema';

export const ScheduleUpdateManyAndReturnSchema = z.object({ select: ScheduleSelectObjectSchema.optional(), data: ScheduleUpdateManyMutationInputObjectSchema, where: ScheduleWhereInputObjectSchema.optional()  }).strict()
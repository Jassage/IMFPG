import { z } from 'zod';
import { ScheduleSelectObjectSchema } from './objects/ScheduleSelect.schema';
import { ScheduleIncludeObjectSchema } from './objects/ScheduleInclude.schema';
import { ScheduleUpdateInputObjectSchema } from './objects/ScheduleUpdateInput.schema';
import { ScheduleUncheckedUpdateInputObjectSchema } from './objects/ScheduleUncheckedUpdateInput.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './objects/ScheduleWhereUniqueInput.schema';

export const ScheduleUpdateOneSchema = z.object({ select: ScheduleSelectObjectSchema.optional(), include: ScheduleIncludeObjectSchema.optional(), data: z.union([ScheduleUpdateInputObjectSchema, ScheduleUncheckedUpdateInputObjectSchema]), where: ScheduleWhereUniqueInputObjectSchema  })
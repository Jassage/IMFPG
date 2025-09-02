import { z } from 'zod';
import { ScheduleSelectObjectSchema } from './objects/ScheduleSelect.schema';
import { ScheduleIncludeObjectSchema } from './objects/ScheduleInclude.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './objects/ScheduleWhereUniqueInput.schema';

export const ScheduleFindUniqueSchema = z.object({ select: ScheduleSelectObjectSchema.optional(), include: ScheduleIncludeObjectSchema.optional(), where: ScheduleWhereUniqueInputObjectSchema })
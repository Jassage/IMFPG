import { z } from 'zod';
import { ScheduleSelectObjectSchema } from './objects/ScheduleSelect.schema';
import { ScheduleIncludeObjectSchema } from './objects/ScheduleInclude.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './objects/ScheduleWhereUniqueInput.schema';

export const ScheduleDeleteOneSchema = z.object({ select: ScheduleSelectObjectSchema.optional(), include: ScheduleIncludeObjectSchema.optional(), where: ScheduleWhereUniqueInputObjectSchema  })
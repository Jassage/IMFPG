import { z } from 'zod';
import { ScheduleSelectObjectSchema } from './objects/ScheduleSelect.schema';
import { ScheduleIncludeObjectSchema } from './objects/ScheduleInclude.schema';
import { ScheduleCreateInputObjectSchema } from './objects/ScheduleCreateInput.schema';
import { ScheduleUncheckedCreateInputObjectSchema } from './objects/ScheduleUncheckedCreateInput.schema';

export const ScheduleCreateOneSchema = z.object({ select: ScheduleSelectObjectSchema.optional(), include: ScheduleIncludeObjectSchema.optional(), data: z.union([ScheduleCreateInputObjectSchema, ScheduleUncheckedCreateInputObjectSchema])  })
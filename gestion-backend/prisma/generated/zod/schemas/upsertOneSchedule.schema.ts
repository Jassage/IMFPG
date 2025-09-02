import { z } from 'zod';
import { ScheduleSelectObjectSchema } from './objects/ScheduleSelect.schema';
import { ScheduleIncludeObjectSchema } from './objects/ScheduleInclude.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './objects/ScheduleWhereUniqueInput.schema';
import { ScheduleCreateInputObjectSchema } from './objects/ScheduleCreateInput.schema';
import { ScheduleUncheckedCreateInputObjectSchema } from './objects/ScheduleUncheckedCreateInput.schema';
import { ScheduleUpdateInputObjectSchema } from './objects/ScheduleUpdateInput.schema';
import { ScheduleUncheckedUpdateInputObjectSchema } from './objects/ScheduleUncheckedUpdateInput.schema';

export const ScheduleUpsertSchema = z.object({ select: ScheduleSelectObjectSchema.optional(), include: ScheduleIncludeObjectSchema.optional(), where: ScheduleWhereUniqueInputObjectSchema, create: z.union([ ScheduleCreateInputObjectSchema, ScheduleUncheckedCreateInputObjectSchema ]), update: z.union([ ScheduleUpdateInputObjectSchema, ScheduleUncheckedUpdateInputObjectSchema ])  })
import { z } from 'zod';
import { TranscriptSelectObjectSchema } from './objects/TranscriptSelect.schema';
import { TranscriptIncludeObjectSchema } from './objects/TranscriptInclude.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './objects/TranscriptWhereUniqueInput.schema';
import { TranscriptCreateInputObjectSchema } from './objects/TranscriptCreateInput.schema';
import { TranscriptUncheckedCreateInputObjectSchema } from './objects/TranscriptUncheckedCreateInput.schema';
import { TranscriptUpdateInputObjectSchema } from './objects/TranscriptUpdateInput.schema';
import { TranscriptUncheckedUpdateInputObjectSchema } from './objects/TranscriptUncheckedUpdateInput.schema';

export const TranscriptUpsertSchema = z.object({ select: TranscriptSelectObjectSchema.optional(), include: TranscriptIncludeObjectSchema.optional(), where: TranscriptWhereUniqueInputObjectSchema, create: z.union([ TranscriptCreateInputObjectSchema, TranscriptUncheckedCreateInputObjectSchema ]), update: z.union([ TranscriptUpdateInputObjectSchema, TranscriptUncheckedUpdateInputObjectSchema ])  })
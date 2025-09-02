import { z } from 'zod';
import { TranscriptSelectObjectSchema } from './objects/TranscriptSelect.schema';
import { TranscriptIncludeObjectSchema } from './objects/TranscriptInclude.schema';
import { TranscriptUpdateInputObjectSchema } from './objects/TranscriptUpdateInput.schema';
import { TranscriptUncheckedUpdateInputObjectSchema } from './objects/TranscriptUncheckedUpdateInput.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './objects/TranscriptWhereUniqueInput.schema';

export const TranscriptUpdateOneSchema = z.object({ select: TranscriptSelectObjectSchema.optional(), include: TranscriptIncludeObjectSchema.optional(), data: z.union([TranscriptUpdateInputObjectSchema, TranscriptUncheckedUpdateInputObjectSchema]), where: TranscriptWhereUniqueInputObjectSchema  })
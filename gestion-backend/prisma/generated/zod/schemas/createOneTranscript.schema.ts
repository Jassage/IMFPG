import { z } from 'zod';
import { TranscriptSelectObjectSchema } from './objects/TranscriptSelect.schema';
import { TranscriptIncludeObjectSchema } from './objects/TranscriptInclude.schema';
import { TranscriptCreateInputObjectSchema } from './objects/TranscriptCreateInput.schema';
import { TranscriptUncheckedCreateInputObjectSchema } from './objects/TranscriptUncheckedCreateInput.schema';

export const TranscriptCreateOneSchema = z.object({ select: TranscriptSelectObjectSchema.optional(), include: TranscriptIncludeObjectSchema.optional(), data: z.union([TranscriptCreateInputObjectSchema, TranscriptUncheckedCreateInputObjectSchema])  })
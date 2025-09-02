import { z } from 'zod';
import { TranscriptSelectObjectSchema } from './objects/TranscriptSelect.schema';
import { TranscriptIncludeObjectSchema } from './objects/TranscriptInclude.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './objects/TranscriptWhereUniqueInput.schema';

export const TranscriptFindUniqueOrThrowSchema = z.object({ select: TranscriptSelectObjectSchema.optional(), include: TranscriptIncludeObjectSchema.optional(), where: TranscriptWhereUniqueInputObjectSchema })
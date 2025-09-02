import { z } from 'zod';
import { TranscriptWhereInputObjectSchema } from './objects/TranscriptWhereInput.schema';

export const TranscriptDeleteManySchema = z.object({ where: TranscriptWhereInputObjectSchema.optional()  })
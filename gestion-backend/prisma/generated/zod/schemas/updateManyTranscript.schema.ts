import { z } from 'zod';
import { TranscriptUpdateManyMutationInputObjectSchema } from './objects/TranscriptUpdateManyMutationInput.schema';
import { TranscriptWhereInputObjectSchema } from './objects/TranscriptWhereInput.schema';

export const TranscriptUpdateManySchema = z.object({ data: TranscriptUpdateManyMutationInputObjectSchema, where: TranscriptWhereInputObjectSchema.optional()  })
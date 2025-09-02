import { z } from 'zod';
import { TranscriptSelectObjectSchema } from './objects/TranscriptSelect.schema';
import { TranscriptUpdateManyMutationInputObjectSchema } from './objects/TranscriptUpdateManyMutationInput.schema';
import { TranscriptWhereInputObjectSchema } from './objects/TranscriptWhereInput.schema';

export const TranscriptUpdateManyAndReturnSchema = z.object({ select: TranscriptSelectObjectSchema.optional(), data: TranscriptUpdateManyMutationInputObjectSchema, where: TranscriptWhereInputObjectSchema.optional()  }).strict()
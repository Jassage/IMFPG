import { z } from 'zod';
import { TranscriptSelectObjectSchema } from './objects/TranscriptSelect.schema';
import { TranscriptCreateManyInputObjectSchema } from './objects/TranscriptCreateManyInput.schema';

export const TranscriptCreateManyAndReturnSchema = z.object({ select: TranscriptSelectObjectSchema.optional(), data: z.union([ TranscriptCreateManyInputObjectSchema, z.array(TranscriptCreateManyInputObjectSchema) ]),  }).strict()
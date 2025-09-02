import { z } from 'zod';
import { TranscriptCreateManyInputObjectSchema } from './objects/TranscriptCreateManyInput.schema';

export const TranscriptCreateManySchema = z.object({ data: z.union([ TranscriptCreateManyInputObjectSchema, z.array(TranscriptCreateManyInputObjectSchema) ]),  })
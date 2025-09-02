import { z } from 'zod';

// prettier-ignore
export const AnalyticsResultSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.unknown(),
    generatedDate: z.date(),
    parameters: z.unknown()
}).strict();

export type AnalyticsResultType = z.infer<typeof AnalyticsResultSchema>;

import { z } from 'zod';

// prettier-ignore
export const AnalyticsInputSchema = z.object({
    type: z.string(),
    data: z.unknown(),
    generatedDate: z.date(),
    parameters: z.unknown()
}).strict();

export type AnalyticsInputType = z.infer<typeof AnalyticsInputSchema>;

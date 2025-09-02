import { z } from 'zod';

// prettier-ignore
export const AnalyticsModelSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.unknown(),
    generatedDate: z.date(),
    parameters: z.unknown()
}).strict();

export type AnalyticsModelType = z.infer<typeof AnalyticsModelSchema>;

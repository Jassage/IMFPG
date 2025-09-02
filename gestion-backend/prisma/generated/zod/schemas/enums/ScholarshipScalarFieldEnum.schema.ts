import { z } from 'zod';

export const ScholarshipScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'amount', 'criteria', 'applicationDeadline', 'academicYearId', 'maxRecipients', 'currentRecipients', 'status'])
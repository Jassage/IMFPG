import { z } from 'zod';
export const UEFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  credits: z.number().int(),
  type: z.unknown(),
  passingGrade: z.number().int(),
  description: z.string().optional(),
  objectives: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.unknown(),
  createdById: z.string(),
  prerequisites: z.array(z.unknown()),
  requiredFor: z.array(z.unknown()),
  assignments: z.array(z.unknown()),
  grades: z.array(z.unknown()),
  retakes: z.array(z.unknown())
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});
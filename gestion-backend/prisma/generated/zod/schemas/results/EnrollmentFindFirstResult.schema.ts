import { z } from 'zod';
export const EnrollmentFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  faculty: z.unknown(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  academicYear: z.unknown(),
  enrollmentDate: z.date(),
  status: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date()
}));
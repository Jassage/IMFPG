import express from 'express';
import {
  createFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
  getFacultyStats
} from '../controllers/facultyController';

const router = express.Router();

router.post('/', createFaculty);
router.get('/', getFaculties);
router.get('/stats', getFacultyStats);
router.get('/:id', getFacultyById);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

export default router;
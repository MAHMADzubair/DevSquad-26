import express from 'express';
import * as movieController from '../../controllers/movie.controller';
import categoryController from '../../controllers/category.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Public
router.get('/', movieController.listMovies);
router.get('/categories', categoryController.getCategories);
router.get('/:movieId', movieController.getMovie);

// Protected: requires login
router.get('/:movieId/play', auth(), movieController.playMovie);

export default router;

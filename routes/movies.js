import express from 'express';
import { body } from 'express-validator';

import {
  getMovieUrl,
  postFavoriteMovie,
  getFavoriteMovie,
} from '../controllers/movies.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get('/movies', isAuth, getMovieUrl);

router.get('/movies/favorite', isAuth, getFavoriteMovie);

router.post(
  '/movies/favorite',
  isAuth,
  [body('title').trim().not().isEmpty()],
  postFavoriteMovie,
);

export default router;

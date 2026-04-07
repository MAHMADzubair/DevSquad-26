import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { movieService, subscriptionService } from '../services';

// ─── Public ──────────────────────────────────────────────────────────────────

export const listMovies = catchAsync(async (req, res) => {
  const { search, genre, year, category, isPremium, page = 1, limit = 12, sortBy } = req.query;

  const filter: any = {};
  if (genre) {
    filter.genres = genre;
  }
  if (year) filter.releaseYear = Number(year);
  if (category) filter.category = String(category);
  if (isPremium !== undefined) filter.isPremium = isPremium === 'true';
  if (search) {
    filter.$or = [
      { title: { $regex: String(search), $options: 'i' } },
      { description: { $regex: String(search), $options: 'i' } },
    ];
  }

  console.log("LIST MOVIES FILTER:", filter);

  const result = await movieService.queryMovies(filter, {
    page: Number(page),
    limit: Number(limit),
    sortBy: sortBy as string,
  });

  res.send(result);
});

export const getMovie = catchAsync(async (req, res) => {
  const movie = await movieService.getMovieById(String(req.params.movieId));
  // Increment view count asynchronously
  movieService.incrementViews(String(req.params.movieId)).catch(() => {});
  res.send(movie);
});

// ─── Protected: returns stream URL ────────────────────────────────────────────

export const playMovie = catchAsync(async (req: any, res) => {
  const movie = await movieService.getMovieById(String(req.params.movieId));

  if (!movie.isPublished) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Movie not available' });
  }

  if (movie.uploadStatus !== 'ready' || !movie.videoUrl) {
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json({ message: 'Video not ready for streaming yet' });
  }

  const user = req.user;

  // Blocked user check
  if (user.isBlocked) {
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Your account has been blocked' });
  }

  // Access check if premium content
  if (movie.isPremium) {
    const hasAccess = await subscriptionService.hasActiveAccess(user.id);
    if (!hasAccess) {
      return res.status(httpStatus.PAYMENT_REQUIRED).json({
        message: 'Subscription required to watch this content',
        requiresSubscription: true,
      });
    }
  }

  res.send({
    streamUrl: movie.hlsUrl || movie.videoUrl,
    hlsUrl: movie.hlsUrl,
    mp4Url: movie.videoUrl,
    title: movie.title,
    posterUrl: movie.posterUrl,
  });
});

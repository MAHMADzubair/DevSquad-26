import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import api from '../lib/axios';
import HeroSection from '../components/Home/HeroSection';
import CategoriesSection from '../components/Home/CategoriesSection';
import ContentRow from '../components/Movies/ContentRow';
import CTASection from '../components/Home/CTASection';

const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const genre = searchParams.get('genre') || '';
  const search = searchParams.get('search') || '';

  const { data: moviesTop10 } = useQuery({
    queryKey: ['movies', 'top10'],
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { limit: 40, category: 'movie', sortBy: 'views:desc' } });
      return data;
    },
  });

  const { data: moviesTrending } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { limit: 10, category: 'movie', sortBy: 'views:desc' } });
      return data;
    },
  });

  const { data: moviesNew } = useQuery({
    queryKey: ['movies', 'new'],
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { limit: 10, category: 'movie', sortBy: 'releaseYear:desc' } });
      return data;
    },
  });

  const { data: moviesMustWatch } = useQuery({
    queryKey: ['movies', 'must-watch'],
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { limit: 10, category: 'movie' } }); // Adjusting to some logic
      return data;
    },
  });

  const { data: showsTop10 } = useQuery({
    queryKey: ['shows', 'top10'],
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { limit: 40, category: 'show', sortBy: 'views:desc' } });
      return data;
    },
  });

  const { data: showsTrending } = useQuery({
    queryKey: ['shows', 'trending'],
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { limit: 10, category: 'show', sortBy: 'views:desc' } });
      return data;
    },
  });



  const { data: showsMustWatch } = useQuery({
    queryKey: ['shows', 'must-watch'],
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { limit: 10, category: 'show' } });
      return data;
    },
  });

  // Helper to group movies by genre for the "Top 10 In Genres" cards
  const groupMoviesByGenre = React.useMemo(() => (results: any[]) => {
    if (!results) return [];
    const groups: Record<string, any> = {};
    
    results.forEach((movie: any) => {
      // Handle the populated genre name
      const genre = movie.genres?.[0]?.name || movie.genres?.[0] || 'Other';
      
      if (!groups[genre]) {
        groups[genre] = {
          id: genre,
          title: genre,
          images: []
        };
      }
      
      // Ensure we only add actual posters, not nulls/blanks
      if (movie.posterUrl && groups[genre].images.length < 4) {
        groups[genre].images.push(movie.posterUrl);
      }
    });

    return Object.values(groups);
  }, []);

  const top10MoviesGrouped = React.useMemo(() => groupMoviesByGenre(moviesTop10?.results), [moviesTop10, groupMoviesByGenre]);
  const top10ShowsGrouped = React.useMemo(() => groupMoviesByGenre(showsTop10?.results), [showsTop10, groupMoviesByGenre]);

  // Search Results Query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['movies', 'search', genre, search],
    enabled: !!(genre || search),
    queryFn: async () => {
      const { data } = await api.get('/movies', { params: { genre, search, limit: 50 } });
      return data;
    },
  });

  const mapToRowFormat = (movies: any[]) => movies?.map(m => ({
    id: m.id || m._id,
    title: m.title,
    image: m.posterUrl,
    duration: m.duration,
    views: m.views > 1000 ? `${(m.views / 1000).toFixed(1)}K` : m.views,
    releaseDate: `${m.releaseYear}`,
    isPremium: m.isPremium,
    images: m.images // For cases where images are already passed (grouped)
  })) || [];

  const isBrowsing = !genre && !search;

  return (
    <div className="w-full bg-bg-custom overflow-hidden">
      {isBrowsing && <HeroSection />}

      <div className="w-full max-w-[1920px] mx-auto pb-[100px] flex flex-col gap-[80px] md:gap-[150px]">
        
        {/* Search Bar (Only shown if results are present or searching) */}
        {!isBrowsing && (
           <div className="px-[15px] laptop:px-[80px] desktop:px-[162px] pt-[120px]">
             <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <h1 className="text-text-p text-[38px] font-bold">Search Results</h1>
                   <button onClick={() => { setSearchParams({}); }} className="text-primary hover:underline">Clear Filters</button>
                </div>
                {isSearching ? (
                   <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : searchResults?.results?.length === 0 ? (
                   <div className="text-center py-40 text-text-s">No content found matching your criteria.</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {searchResults?.results?.map((movie: any) => (
                      <div 
                        key={movie.id || movie._id}
                        onClick={() => navigate(`/movies/${movie.id || movie._id}`)}
                        className="bg-surface border border-border-darker rounded-[12px] p-4 flex flex-col gap-4 cursor-pointer hover:border-primary transition-all group hover:-translate-y-1"
                      >
                        <div className="relative aspect-[2/3] rounded-[8px] overflow-hidden bg-bg-darker">
                          <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <Play fill="currentColor" size={20} className="text-white translate-x-0.5" />
                            </div>
                          </div>
                          {movie.isPremium && (
                            <span className="absolute top-2 right-2 bg-primary text-text-p text-[10px] font-bold px-2 py-1 rounded">PREMIUM</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-text-p text-[16px] font-bold truncate">{movie.title}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-text-s text-[12px]">{movie.releaseYear}</span>
                            <span className="text-text-s text-[12px] truncate max-w-[100px]">{movie.genres?.[0]?.name || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </div>
        )}

        {isBrowsing && (
          <div className="flex flex-col gap-[100px] md:gap-[150px] px-[15px] laptop:px-[80px] desktop:px-[162px] mt-10 md:mt-20">
            {/* MOVIES SECTION BOX WITH LEGEND STYLE BORDER */}
            <div className="relative flex flex-col gap-[60px] md:gap-[100px] border border-border-darker rounded-[12px] p-6 md:px-12 md:py-16 bg-surface/10">
              {/* Legend Label */}
              <div className="absolute top-0 left-6 md:left-12 -translate-y-1/2">
                <span className="inline-block px-6 py-2 bg-primary text-text-p font-bold rounded-[6px] shadow-lg">
                  Movies
                </span>
              </div>

              <div className="flex flex-col gap-[80px] md:gap-[100px]">
                <CategoriesSection 
                  title="Our Genres" 
                  showContainer={false} 
                  genreData={top10MoviesGrouped} 
                />

                {top10MoviesGrouped?.length > 0 && (
                  <ContentRow title="Popular Top 10 In Genres" movies={mapToRowFormat(top10MoviesGrouped)} variant="top-10" />
                )}

                {moviesTrending?.results?.length > 0 && (
                  <ContentRow title="Trending Now" movies={mapToRowFormat(moviesTrending.results)} variant="trending" />
                )}

                {moviesNew?.results?.length > 0 && (
                  <ContentRow title="New Releases" movies={mapToRowFormat(moviesNew.results)} variant="new-release" />
                )}

                {moviesMustWatch?.results?.length > 0 && (
                  <ContentRow title="Must - Watch Movies" movies={mapToRowFormat(moviesMustWatch.results)} variant="must-watch" />
                )}
              </div>
            </div>

            {/* SHOWS SECTION BOX WITH LEGEND STYLE BORDER */}
            <div className="relative flex flex-col gap-[60px] md:gap-[100px] border border-border-darker rounded-[12px] p-6 md:px-12 md:py-16 bg-surface/10">
              {/* Legend Label */}
              <div className="absolute top-0 left-6 md:left-12 -translate-y-1/2">
                <span className="inline-block px-6 py-2 bg-primary text-text-p font-bold rounded-[6px] shadow-lg">
                  Shows
                </span>
              </div>

              <div className="flex flex-col gap-[80px] md:gap-[100px]">
                <CategoriesSection 
                  title="Our Genres" 
                  showContainer={false} 
                  genreData={top10ShowsGrouped} 
                />

                {top10ShowsGrouped?.length > 0 && (
                  <ContentRow title="Popular Top 10 In Genres" movies={mapToRowFormat(top10ShowsGrouped)} variant="top-10" />
                )}

                {showsTrending?.results?.length > 0 && (
                  <ContentRow title="Trending Now" movies={mapToRowFormat(showsTrending.results)} variant="trending" />
                )}

                {showsMustWatch?.results?.length > 0 && (
                  <ContentRow title="Must - Watch Movies" movies={mapToRowFormat(showsMustWatch.results)} variant="must-watch" />
                )}
              </div>
            </div>
          </div>
        )}

        {isBrowsing && <CTASection />}
      </div>
    </div>
  );
};

export default MoviesPage;


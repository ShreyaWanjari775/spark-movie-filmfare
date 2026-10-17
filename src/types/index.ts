export interface Movie {
  id: string;
  title: string;
  movie?: string | null;
  release_year: number;
  poster_url: string;
  synopsis: string;
  director: string;
  genres: string[];
  duration?: string;
  tagline?: string;
}

export interface Category {
  id: string;
  title: string;
  isRequired: boolean;
  tagline: string;
  description: string;
  icon: string;
  nominees: Movie[];
}

export interface EventDetails {
  title: string;
  edition: string;
  eventName: string;
  venue: string;
  date: string;
  tagline: string;
  description: string;
}

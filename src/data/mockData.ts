import type { Category, EventDetails, Movie } from '../types';

export const EVENT_DETAILS: EventDetails = {
  title: "SPark Movie Filmfare",
  edition: "2026 Cultural Edition",
  eventName: "FnC (Flicks 'n Chill)",
  venue: "Saradar Patel Institute of Technology College",
  date: "Movie Night • 23rd October • 6:00 PM",
  tagline: "Your Voice. The Silver Screen. The Winners Revealed Live.",
  description: "Welcome to the ultimate college cinema ballot. Scan, vote for your favourite cinematic masterworks across genres, and join us under the stars as the winning films are crowned live during FnC Movie Night."
};

// Master Movie Catalog
export const MOVIES: Record<string, Movie> = {
  dune2: {
    id: "m_dune2",
    title: "Dune: Part Two",
    release_year: 2024,
    poster_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Action", "Adventure"],
    duration: "2h 46m",
    tagline: "Long live the fighters."
  },
  spiderverse: {
    id: "m_spiderverse",
    title: "Spider-Man: Across the Spider-Verse",
    release_year: 2023,
    poster_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    director: "Joaquim Dos Santos, Kemp Powers",
    genres: ["Animated", "Sci-Fi", "Action"],
    duration: "2h 20m",
    tagline: "It's how you wear the mask that matters."
  },
  interstellar: {
    id: "m_interstellar",
    title: "Interstellar",
    release_year: 2014,
    poster_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft through a wormhole.",
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Drama"],
    duration: "2h 49m",
    tagline: "Mankind was born on Earth. It was never meant to die here."
  },
  oppenheimer: {
    id: "m_oppenheimer",
    title: "Oppenheimer",
    release_year: 2023,
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    director: "Christopher Nolan",
    genres: ["Thriller", "Drama", "History"],
    duration: "3h 00m",
    tagline: "The world forever changes."
  },
  alien_romulus: {
    id: "m_alien_romulus",
    title: "Alien: Romulus",
    release_year: 2024,
    poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    synopsis: "While scavenging the deep ends of a derelict space station, a group of young space colonists come face to face with the most terrifying life form in the universe.",
    director: "Fede Álvarez",
    genres: ["Horror", "Sci-Fi", "Thriller"],
    duration: "1h 59m",
    tagline: "In space, no one can hear you scream."
  },
  late_night_devil: {
    id: "m_late_night_devil",
    title: "Late Night with the Devil",
    release_year: 2024,
    poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    synopsis: "A live television broadcast in 1977 goes horribly wrong, unloosing evil into the living rooms of America.",
    director: "Cameron Cairnes, Colin Cairnes",
    genres: ["Horror", "Thriller"],
    duration: "1h 33m",
    tagline: "Do not adjust your television set."
  },
  john_wick_4: {
    id: "m_john_wick_4",
    title: "John Wick: Chapter 4",
    release_year: 2023,
    poster_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    synopsis: "John Wick uncovers a path to defeating The High Table, but before he can earn his freedom, he must face a new enemy with powerful alliances.",
    director: "Chad Stahelski",
    genres: ["Action", "Thriller"],
    duration: "2h 49m",
    tagline: "Baba Yaga returns."
  },
  batman: {
    id: "m_batman",
    title: "The Batman",
    release_year: 2022,
    poster_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800&auto=format&fit=crop",
    synopsis: "In his second year of fighting crime, Batman pursues the Riddler, a sadistic serial killer who targets Gotham City's corrupt elites.",
    director: "Matt Reeves",
    genres: ["Action", "Thriller", "Mystery"],
    duration: "2h 56m",
    tagline: "Unmask the truth."
  },
  deadpool_wolverine: {
    id: "m_deadpool_wolverine",
    title: "Deadpool & Wolverine",
    release_year: 2024,
    poster_url: "https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?q=80&w=800&auto=format&fit=crop",
    synopsis: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him, until the TVA recruits him.",
    director: "Shawn Levy",
    genres: ["Comedy", "Action", "Sci-Fi"],
    duration: "2h 07m",
    tagline: "Come together."
  },
  barbie: {
    id: "m_barbie",
    title: "Barbie",
    release_year: 2023,
    poster_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    synopsis: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land until they get a chance to go to the real world.",
    director: "Greta Gerwig",
    genres: ["Comedy", "Fantasy"],
    duration: "1h 54m",
    tagline: "She's everything. He's just Ken."
  },
  boy_and_heron: {
    id: "m_boy_and_heron",
    title: "The Boy and the Heron",
    release_year: 2023,
    poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    synopsis: "A young boy named Mahito yearning for his mother ventures into a world shared by the living and the dead, guided by a talking grey heron.",
    director: "Hayao Miyazaki",
    genres: ["Animated", "Fantasy", "Drama"],
    duration: "2h 04m",
    tagline: "Where death comes to an end, and life finds a new beginning."
  },
  parasite: {
    id: "m_parasite",
    title: "Parasite",
    release_year: 2019,
    poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    director: "Bong Joon-ho",
    genres: ["Thriller", "Drama"],
    duration: "2h 12m",
    tagline: "Act like you own the place."
  }
};

// Genre Categories with Movie Nominees
// (Notice: Some movies like Dune 2, Batman, Late Night with the Devil appear in multiple genres!)
export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat_scifi",
    title: "Best Sci-Fi",
    isRequired: true,
    tagline: "Visions of the Cosmos & Beyond",
    description: "Honouring mind-expanding speculative universes, cosmic odysseys, and technological wonders.",
    icon: "Rocket",
    nominees: [
      MOVIES.dune2,
      MOVIES.spiderverse,
      MOVIES.interstellar,
      MOVIES.alien_romulus
    ]
  },
  {
    id: "cat_horror",
    title: "Best Horror",
    isRequired: true,
    tagline: "Spine-Chilling Nightmares",
    description: "The most gripping, dread-inducing cinematic experiences that made hearts pound.",
    icon: "Ghost",
    nominees: [
      MOVIES.alien_romulus,
      MOVIES.late_night_devil
    ]
  },
  {
    id: "cat_action",
    title: "Would never spend a day in this movie even if I was offered a million bucks",
    isRequired: true,
    tagline: "Pure Adrenaline & Spectacle",
    description: "Pulse-pounding stunts, relentless pacing, and masterfully choreographed cinematic set-pieces.",
    icon: "Flame",
    nominees: [
      MOVIES.dune2,
      MOVIES.john_wick_4,
      MOVIES.batman,
      MOVIES.deadpool_wolverine
    ]
  },
  {
    id: "cat_thriller",
    title: "Best Thriller",
    isRequired: true,
    tagline: "High Stakes & Psychological Edge",
    description: "Edge-of-the-seat tension, intricate plotting, and psychological suspense.",
    icon: "Eye",
    nominees: [
      MOVIES.oppenheimer,
      MOVIES.parasite,
      MOVIES.late_night_devil,
      MOVIES.batman
    ]
  },
  {
    id: "cat_comedy",
    title: "Best Comedy",
    isRequired: true,
    tagline: "Wit, Charm & Crowd Roars",
    description: "Films that brought contagious laughter, clever satire, and unforgettable punchlines.",
    icon: "Smile",
    nominees: [
      MOVIES.deadpool_wolverine,
      MOVIES.barbie
    ]
  },
  {
    id: "cat_animated",
    title: "Best Animated",
    isRequired: true,
    tagline: "Artistry in Every Frame",
    description: "Visual marvels transcending reality through breathtaking artistry and imagination.",
    icon: "Sparkles",
    nominees: [
      MOVIES.spiderverse,
      MOVIES.boy_and_heron
    ]
  }
];

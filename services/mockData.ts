import { Coach, Course, CourseLevel, UserRole } from '../types';

export const MOCK_COACHES: Coach[] = [
  {
    id: 'coach-anna-petrova',
    name: 'Anna Petrova',
    email: 'anna.petrova@chessmentor.com',
    avatarUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: UserRole.COACH,
    bio: 'Woman Grandmaster with a passion for aggressive, tactical chess. I specialize in the Sicilian Defense and helping students sharpen their attacking skills.',
    rating: 2450,
    experience: 10,
    languages: ['English', 'Russian'],
    specialties: ['Sicilian Defense', 'Attacking Chess', 'Tactical Vision', 'Advanced Strategy'],
    hourlyRate: 90,
    availability: {},
  },
  {
    id: 'coach-ben-carter',
    name: 'Ben Carter',
    email: 'ben.carter@chessmentor.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: UserRole.COACH,
    bio: "International Master dedicated to building strong foundations. I believe in making chess fun and accessible for everyone, from absolute beginners to club players.",
    rating: 2200,
    experience: 8,
    languages: ['English', 'Spanish'],
    specialties: ['Opening Principles', 'Beginner Friendly', 'Chess Fundamentals', 'Positional Play'],
    hourlyRate: 65,
    availability: {},
  },
  {
    id: 'coach-carlos-rodriguez',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@chessmentor.com',
    avatarUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: UserRole.COACH,
    bio: "FIDE Master and endgame specialist. I can teach you how to convert advantages and save lost positions. My lessons are practical and focused on results.",
    rating: 2310,
    experience: 15,
    languages: ['Spanish', 'English'],
    specialties: ['Endgame Technique', 'Rook Endgames', 'Pawn Structures', 'Prophylactic Thinking'],
    hourlyRate: 75,
    availability: {},
  }
];

export const MOCK_COURSES: Course[] = [
    {
        id: 'course-intro-to-chess',
        title: 'Complete Introduction to Chess',
        description: 'Learn everything you need to know to play chess, from how the pieces move to basic strategies and checkmates. Perfect for absolute beginners!',
        coachId: 'coach-ben-carter',
        level: CourseLevel.BEGINNER,
        price: 49.99,
        lessons: [
            { id: 'l1', title: 'The Board and The Pieces', videoUrl: '', description: 'Get to know your battlefield and your army.', pgn: '8/8/8/8/8/8/8/8 w - - 0 1' },
            { id: 'l2', title: 'Basic Checkmates', videoUrl: '', description: 'Learn how to win the game with fundamental checkmating patterns.', pgn: '5k2/R7/8/8/8/8/8/4K3 w - - 0 1' },
            { id: 'l3', title: 'Opening Principles', videoUrl: '', description: 'Start your games with confidence by controlling the center.', pgn: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1' },
        ]
    },
    {
        id: 'course-mastering-sicilian',
        title: 'Mastering the Sicilian Defense',
        description: 'A deep dive into one of the most popular and aggressive responses to 1.e4. Suitable for intermediate players looking to expand their opening repertoire.',
        coachId: 'coach-anna-petrova',
        level: CourseLevel.INTERMEDIATE,
        price: 79.99,
        lessons: [
            { id: 'l1', title: 'Introduction to the Sicilian', videoUrl: '', description: 'Understand the core ideas behind this powerful defense.', pgn: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2' },
            { id: 'l2', title: 'The Najdorf Variation', videoUrl: '', description: 'Explore the main lines of the most popular Sicilian system.', pgn: 'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6' },
            { id: 'l3', title: 'Handling Anti-Sicilians', videoUrl: '', description: 'Learn how to counter White\'s tricky sidelines.', pgn: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3' },
        ]
    },
    {
        id: 'course-endgame-principles',
        title: 'Practical Endgame Principles',
        description: 'Most games are decided in the endgame. Learn the essential principles that will help you convert advantages and save difficult positions.',
        coachId: 'coach-carlos-rodriguez',
        level: CourseLevel.INTERMEDIATE,
        price: 69.99,
        lessons: [
            { id: 'l1', title: 'King and Pawn Endgames', videoUrl: '', description: 'The most fundamental and important type of endgame.', pgn: '8/8/3k4/8/8/3K4/8/8 w - - 0 1' },
            { id: 'l2', title: 'Rook and Pawn Endgames', videoUrl: '', description: 'Mastering rook endgames is key to practical success.', pgn: '8/8/8/R2k4/8/3K4/pr6/8 w - - 0 1' },
            { id: 'l3', title: 'The Principle of Two Weaknesses', videoUrl: '', description: 'A key strategic concept for converting an advantage.', pgn: '8/p7/1p6/1Ppk4/P7/3K4/8/8 w - - 0 1' },
        ]
    },
    {
        id: 'course-advanced-tactics',
        title: 'Advanced Attacking Chess',
        description: 'Unleash your inner tactician. This course covers advanced motifs, calculation techniques, and how to build a winning attack against the enemy king.',
        coachId: 'coach-anna-petrova',
        level: CourseLevel.ADVANCED,
        price: 99.99,
        lessons: [
            { id: 'l1', title: 'Sacrifices on h7', videoUrl: '', description: 'Learn the classic Greek Gift sacrifice.', pgn: 'r1bqr1k1/ppp2pbp/2np1np1/8/2BNP3/2N1B3/PPPQ1PPP/R3K2R w KQ - 4 9' },
            { id: 'l2', title: 'Opposite-Side Castling Attacks', videoUrl: '', description: 'Master the art of the pawn storm.', pgn: 'r3r1k1/1bqnbppp/p2p1n2/1p2p3/3NP3/P1N1BP2/1PP1B1PP/R2Q1RK1 w - - 0 13' },
        ]
    },
];

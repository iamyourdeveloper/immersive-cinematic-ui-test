import { create } from 'zustand'

// Room definitions - each represents a section of the Hall
export const ROOMS = {
  ENTRANCE: 'entrance',
  LOBBY: 'lobby',
  ORIGIN_STORIES: 'origin-stories',
  INSPIRATION_GARDEN: 'inspiration-garden',
  PRODUCT_SHOWCASE: 'product-showcase',
  LIBRARY: 'library',
  QUIZ: 'quiz',
  THANK_YOU: 'thank-you'
}

// Room order for navigation
export const ROOM_ORDER = [
  ROOMS.ENTRANCE,
  ROOMS.LOBBY,
  ROOMS.ORIGIN_STORIES,
  ROOMS.INSPIRATION_GARDEN,
  ROOMS.PRODUCT_SHOWCASE,
  ROOMS.LIBRARY,
  ROOMS.QUIZ,
  ROOMS.THANK_YOU
]

// Room metadata
export const ROOM_DATA = {
  [ROOMS.ENTRANCE]: {
    title: 'Welcome',
    subtitle: 'Explore The Hall of Zero Limits',
    description: 'Enter the experience'
  },
  [ROOMS.LOBBY]: {
    title: 'The Hall of Zero Limits',
    subtitle: 'Where infinite potential grows',
    description: 'Step into the heart of the Hall'
  },
  [ROOMS.ORIGIN_STORIES]: {
    title: 'Origin Stories',
    subtitle: 'Find Your Inspiration',
    description: 'Discover the journeys of remarkable creators'
  },
  [ROOMS.INSPIRATION_GARDEN]: {
    title: 'Inspiration Garden',
    subtitle: 'Where Ingenuity Overflows',
    description: 'Honor the visionaries who paved the way'
  },
  [ROOMS.PRODUCT_SHOWCASE]: {
    title: 'Sprite Zero Sugar®',
    subtitle: 'Open Your Infinite Potential',
    description: 'Refresh your creativity'
  },
  [ROOMS.LIBRARY]: {
    title: 'The Library',
    subtitle: 'More Help Finding Your Gift',
    description: 'Learn from those who found their path'
  },
  [ROOMS.QUIZ]: {
    title: 'Find Your Gift',
    subtitle: 'Reflection & Discovery',
    description: 'Uncover your unique potential'
  },
  [ROOMS.THANK_YOU]: {
    title: 'Thank You',
    subtitle: 'Share the Experience',
    description: 'Continue your journey'
  }
}

// Quiz Questions Data
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    line1: 'SELECT A',
    line2: 'MOVIE GENRE',
    options: ['DOCUMENTARY', 'COMEDY'],
    // Documentary = analytical/decoder, Comedy = creative/avant-garde
    traits: ['decoder', 'avant-garde']
  },
  {
    id: 2,
    line1: "YOU'D BE MORE",
    line2: 'INSPIRED AS A',
    options: ['CONTENT CREATOR', 'PROGRAMMER'],
    // Content Creator = visionary/avant-garde, Programmer = decoder/illuminator
    traits: ['avant-garde', 'decoder']
  },
  {
    id: 3,
    line1: "YOU'D RATHER",
    line2: 'DISCUSS:',
    options: ['ASTROLOGY', 'ASTRONOMY'],
    // Astrology = visionary/explorer, Astronomy = decoder/illuminator
    traits: ['visionary', 'illuminator']
  },
  {
    id: 4,
    line1: "YOU'D",
    line2: 'PREFER TO:',
    options: ['TAKE SOMETHING APART', 'CREATE A BETTER VERSION'],
    // Take Apart = decoder/explorer, Create Better = illuminator/visionary
    traits: ['decoder', 'illuminator']
  }
]

// Quiz Result Types
export const QUIZ_RESULTS = {
  decoder: {
    id: 'decoder',
    name: 'The Decoder',
    description: "Numbers form a bridge between the abstract and physical worlds, and perhaps the path to discovering your gift. Analytical and strategic, you're adept at zeroing in on the connection between new problems and existing knowledge. You can inspire by teaching, influence policy via research, secure futures in accounting and finance, and inform the creative process in a multitude of fields."
  },
  visionary: {
    id: 'visionary',
    name: 'The Visionary',
    description: "Where others see a door closing, you see an opportunity to open it—and often, build a better one. As an innovator and creator, you're not only a problem solver, but a problem seeker. You always find ways to improve the world around you and are creative enough to envision it differently. A myriad of paths awaits you—among them sound, design, software, aerospace, industrial, biomedical and more."
  },
  illuminator: {
    id: 'illuminator',
    name: 'The Illuminator',
    description: "You're inspired by the power of the question, \"What if?\" Whether optimizing existing systems and processes or experimenting with new ideas to invent them, you're well-equipped with the creativity and ingenuity it takes to propel our world forward. From programming and developing, to data modeling and analyzing, there are zero limits to your potential."
  },
  'avant-garde': {
    id: 'avant-garde',
    name: 'The Avant-Garde',
    description: "Creative to your core, your strong imagination and unique vision are your gifts, not only as your life's path, but also your gifts to the world around you. Film, music, fine arts, gaming, fashion and cuisine are among the canvasses upon which you can leave your mark. Opportunities for you to make the world a better, more beautiful place are as vast as the imagination, which for you is limitless."
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    description: "Driven by a mind filled with infinite wonder and a penchant for investigation, your calling lives where curiosity, discovery and observation converge. Plants, animals, computers, data, health, artificial intelligence—your potential spans as far as the ocean is from the sun. Perhaps it's your very nature that led you to the Hall of Zero Limits, and may this be the first of many hypotheses you test."
  }
}

// Calculate quiz result based on answers
export function calculateQuizResult(answers) {
  const scores = {
    decoder: 0,
    visionary: 0,
    illuminator: 0,
    'avant-garde': 0,
    explorer: 0
  }

  // Calculate scores based on answers
  answers.forEach((answerIndex, questionIndex) => {
    const question = QUIZ_QUESTIONS[questionIndex]
    const selectedTrait = question.traits[answerIndex]
    scores[selectedTrait] += 25

    // Add secondary points to related traits
    if (selectedTrait === 'decoder') {
      scores['illuminator'] += 8
      scores['explorer'] += 5
    } else if (selectedTrait === 'avant-garde') {
      scores['visionary'] += 8
      scores['explorer'] += 5
    } else if (selectedTrait === 'visionary') {
      scores['avant-garde'] += 8
      scores['illuminator'] += 5
    } else if (selectedTrait === 'illuminator') {
      scores['decoder'] += 8
      scores['visionary'] += 5
    } else if (selectedTrait === 'explorer') {
      scores['decoder'] += 5
      scores['visionary'] += 5
    }
  })

  // Find primary and secondary results
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const primaryId = sortedScores[0][0]
  const secondaryId = sortedScores[1][0]

  // Normalize scores to percentages
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0)
  const normalizedScores = {}
  Object.keys(scores).forEach(key => {
    normalizedScores[key] = Math.round((scores[key] / total) * 100)
  })

  return {
    primary: QUIZ_RESULTS[primaryId],
    secondary: QUIZ_RESULTS[secondaryId],
    scores: normalizedScores
  }
}

// Creator profiles data
export const CREATORS = {
  originStories: [
    {
      id: 'hannah-beachler',
      name: 'Hannah Beachler',
      title: 'Production Designer',
      wakandaText: 'YMBAKANDA SELLER',
      image: '/images/creators/hannah.png',
      videoUrl: 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/videos/hannah.webm'
    },
    {
      id: 'jasmine-alexia',
      name: 'Jasmine Alexia',
      title: 'Storyboard Artist',
      wakandaText: 'YOKAMTWIT MTXALA',
      image: '/images/creators/jasmine.png',
      videoUrl: 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/videos/jasmine.webm'
    },
    {
      id: 'alicia-diaz',
      name: 'Alícia Díaz',
      title: 'Sculptor',
      wakandaText: 'YOKABAL',
      image: '/images/creators/alicia.png',
      videoUrl: 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/videos/alicia.webm'
    }
  ],
  library: [
    {
      id: 'naya',
      name: 'Naya',
      title: 'Software Engineer',
      wakandaText: 'YMOKAVY8 8FFVXBFY',
      image: '/images/creators/naya.png',
      videoUrl: 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/videos/naya.webm'
    },
    {
      id: 'reyna-noriega',
      name: 'Reyna Noriega',
      title: 'Visual Artist & Author',
      wakandaText: 'MX1OV3 VTMX1A & YOABVY',
      image: '/images/creators/reyna.png',
      videoUrl: 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/videos/reyna.webm'
    },
    {
      id: 'joan-marie',
      name: 'Joan Marie',
      title: 'Space Engineer',
      wakandaText: 'FYMV 8VKKFVY',
      image: '/images/creators/joan.png',
      videoUrl: 'https://wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/videos/joan.webm'
    }
  ],
  inspirationGarden: [
    {
      id: 'dora-milaje',
      name: 'Dora Milaje',
      wakandaText: 'JHTY BXDYAZ',
      quote: '"I AM LOYAL TO THAT THRONE, NO MATTER WHO SITS ON IT."',
      description: 'Much can be gleaned from these elite warriors who provide protection and intel to protect the crown and country. Though known for being physically skilled in battle, their minds are also among their greatest weapons—overcoming and embracing adversity and solving problems as quickly as they arise. Do the Dora\'s gifts reflect yours?'
    },
    {
      id: 'shuri',
      name: 'Shuri',
      wakandaText: 'COOTX',
      quote: '"JUST BECAUSE SOMETHING WORKS DOESN\'T MEAN IT CAN\'T BE IMPROVED."',
      description: 'Both a problem solver and maker by nature, Shuri is a visionary, illuminator, decoder, explorer and avant-garde. She\'s unapologetically bold in her role as a leader across the board— as a master engineer, designer, tech inventor, mathematician, and scientist. Her innovations are of incredible importance to her community. Perhaps when you look at Shuri, you see glimpses of yourself there as well.'
    },
    {
      id: 'mbaku',
      name: "M'Baku",
      wakandaText: "B'EYAO",
      quote: '"WITNESS THE STRENGTH OF THE JABARI... FIRST-HAND!"',
      description: 'Behold the gifts of a great leader: determination, courage, and passion. M\'Baku\'s superhuman physical agility and strength are particularly impressive when combined with his superior mental agility—strategic, analytical, patient, and tenacious when met with obstacles. Do you think these characteristics would serve you well?'
    }
  ]
}

// Zustand store
export const useAppStore = create((set, get) => ({
  // Current room/section
  currentRoom: ROOMS.ENTRANCE,
  previousRoom: null,
  isTransitioning: false,
  
  // Navigation
  setCurrentRoom: (room) => set((state) => ({
    previousRoom: state.currentRoom,
    currentRoom: room
  })),
  
  goToNextRoom: () => {
    const { currentRoom, isTransitioning } = get()
    if (isTransitioning) return
    
    const currentIndex = ROOM_ORDER.indexOf(currentRoom)
    if (currentIndex < ROOM_ORDER.length - 1) {
      set({ isTransitioning: true })
      setTimeout(() => {
        set({
          previousRoom: currentRoom,
          currentRoom: ROOM_ORDER[currentIndex + 1],
          isTransitioning: false
        })
      }, 800)
    }
  },
  
  goToPrevRoom: () => {
    const { currentRoom, isTransitioning } = get()
    if (isTransitioning) return
    
    const currentIndex = ROOM_ORDER.indexOf(currentRoom)
    if (currentIndex > 0) {
      set({ isTransitioning: true })
      setTimeout(() => {
        set({
          previousRoom: currentRoom,
          currentRoom: ROOM_ORDER[currentIndex - 1],
          isTransitioning: false
        })
      }, 800)
    }
  },
  
  setIsTransitioning: (value) => set({ isTransitioning: value }),
  
  // UI State
  isMenuOpen: false,
  activeModal: null,
  activeVideo: null,
  hoveredCreator: null,
  isCardHovered: false,
  videoModalData: null,
  quoteModalData: null,
  hoveredStatue: null,
  isStatueCardHovered: false,
  
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  
  playVideo: (videoId) => set({ activeVideo: videoId }),
  stopVideo: () => set({ activeVideo: null }),
  
  setHoveredCreator: (creator) => set({ hoveredCreator: creator }),
  clearHoveredCreator: () => {
    const { isCardHovered } = get()
    // Only clear if the card is not being hovered
    if (!isCardHovered) {
      set({ hoveredCreator: null })
    }
  },
  forceCloseHoveredCreator: () => set({ hoveredCreator: null, isCardHovered: false }),
  
  setCardHovered: (isHovered) => set({ isCardHovered: isHovered }),
  
  openVideoModal: (creatorData) => set({ videoModalData: creatorData, hoveredCreator: null, isCardHovered: false }),
  closeVideoModal: () => set({ videoModalData: null }),
  
  // Quote Modal (for Inspiration Garden)
  openQuoteModal: (characterData) => set({ quoteModalData: characterData, hoveredStatue: null, isStatueCardHovered: false }),
  closeQuoteModal: () => set({ quoteModalData: null }),
  
  // Statue hover state (for Inspiration Garden)
  setHoveredStatue: (statue) => set({ hoveredStatue: statue }),
  clearHoveredStatue: () => {
    const { isStatueCardHovered } = get()
    if (!isStatueCardHovered) {
      set({ hoveredStatue: null })
    }
  },
  forceCloseHoveredStatue: () => set({ hoveredStatue: null, isStatueCardHovered: false }),
  setStatueCardHovered: (isHovered) => set({ isStatueCardHovered: isHovered }),
  
  // Quiz state
  isQuizOpen: false,
  quizPhase: 'intro', // 'intro', 'questions', 'result'
  quizAnswers: [],
  quizResult: null,
  
  openQuiz: () => set({ isQuizOpen: true, quizPhase: 'intro', quizAnswers: [], quizResult: null }),
  closeQuiz: () => set({ isQuizOpen: false }),
  
  startQuiz: () => set({ quizPhase: 'questions', quizAnswers: [], quizResult: null }),
  
  answerQuizQuestion: (answer) => {
    const { quizAnswers } = get()
    const newAnswers = [...quizAnswers, answer]
    
    // Check if quiz is complete
    if (newAnswers.length >= QUIZ_QUESTIONS.length) {
      const result = calculateQuizResult(newAnswers)
      set({ quizAnswers: newAnswers, quizResult: result, quizPhase: 'result' })
    } else {
      set({ quizAnswers: newAnswers })
    }
  },
  
  goToPrevQuestion: () => set((state) => ({
    quizAnswers: state.quizAnswers.slice(0, -1)
  })),
  
  setQuizResult: (result) => set({ quizResult: result, quizPhase: 'result' }),
  
  resetQuiz: () => set({ quizPhase: 'intro', quizAnswers: [], quizResult: null }),
  
  // Loading state
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  // Audio
  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted }))
}))

export default useAppStore


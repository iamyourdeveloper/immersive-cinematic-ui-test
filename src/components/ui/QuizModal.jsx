import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, QUIZ_QUESTIONS, QUIZ_RESULTS, calculateQuizResult } from '../../store/useAppStore'

// Generate random Wakanda-style text
function generateWakandaText() {
  const chars = 'ⲀⲂⲈⲎⲒⲔⲘⲚⲞⲢⲤⲦⲨⲬⲰ▸◂△▽◇○'
  let text = ''
  const length = Math.floor(Math.random() * 4) + 6
  for (let i = 0; i < length; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return text
}

export default function QuizModal() {
  const isQuizOpen = useAppStore((state) => state.isQuizOpen)
  const quizPhase = useAppStore((state) => state.quizPhase)
  const quizAnswers = useAppStore((state) => state.quizAnswers)
  const quizResult = useAppStore((state) => state.quizResult)
  const closeQuiz = useAppStore((state) => state.closeQuiz)
  const startQuiz = useAppStore((state) => state.startQuiz)
  const answerQuizQuestion = useAppStore((state) => state.answerQuizQuestion)
  const goToPrevQuestion = useAppStore((state) => state.goToPrevQuestion)
  const resetQuiz = useAppStore((state) => state.resetQuiz)

  const [hoveredOption, setHoveredOption] = useState(null)
  const [showOtherCharacteristics, setShowOtherCharacteristics] = useState(false)

  // Calculate current question index
  const currentQuestionIndex = quizAnswers.length
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]

  if (!isQuizOpen) return null

  return (
    <motion.div
      className="quiz-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <QuizHeader onClose={closeQuiz} />

      {/* Main Content Area */}
      <div className="quiz-content-wrapper">
        <AnimatePresence mode="wait">
          {quizPhase === 'intro' && (
            <QuizIntro key="intro" onStart={startQuiz} />
          )}
          {quizPhase === 'questions' && currentQuestion && (
            <QuizQuestion
              key={`question-${currentQuestionIndex}`}
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={QUIZ_QUESTIONS.length}
              onAnswer={answerQuizQuestion}
              onPrev={currentQuestionIndex > 0 ? goToPrevQuestion : null}
              hoveredOption={hoveredOption}
              setHoveredOption={setHoveredOption}
            />
          )}
          {quizPhase === 'result' && quizResult && (
            <QuizResult
              key="result"
              result={quizResult}
              showOther={showOtherCharacteristics}
              setShowOther={setShowOtherCharacteristics}
              onRetake={resetQuiz}
              onContinue={closeQuiz}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <QuizFooter phase={quizPhase} onKeepExploring={closeQuiz} />
    </motion.div>
  )
}

// Header Component
function QuizHeader({ onClose }) {
  return (
    <header className="quiz-header">
      {/* Logo */}
      <div className="quiz-header-logo">
        <span className="logo-the">THE</span>
        <span className="logo-hall">HALL</span>
        <span className="logo-of">OF</span>
        <br />
        <span className="logo-zero">ZERO</span>
        <span className="logo-limits">LIMITS</span>
      </div>

      {/* Close Button */}
      <button className="quiz-close-btn" onClick={onClose}>
        <span className="close-x">✕</span>
        <span className="close-text">CLOSE QUIZ</span>
        <span className="close-line"></span>
      </button>
    </header>
  )
}

// Intro Screen
function QuizIntro({ onStart }) {
  return (
    <motion.div
      className="quiz-intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="quiz-intro-frame">
        {/* Corner Accents */}
        <div className="quiz-corner top-left"></div>
        <div className="quiz-corner top-right"></div>
        <div className="quiz-corner bottom-left"></div>
        <div className="quiz-corner bottom-right"></div>

        {/* Decorative Elements */}
        <div className="quiz-intro-decor-top">
          <span className="decor-dash"></span>
        </div>

        {/* Title */}
        <div className="quiz-intro-title-group">
          <span className="title-accent">✦◇✦</span>
          <h1 className="quiz-intro-title">
            <span className="title-find">FIND</span>
            <span className="title-your">YOUR GIFT</span>
          </h1>
          <span className="title-accent">✦◇✦</span>
        </div>

        <div className="quiz-intro-decor-bottom">
          <span className="decor-dash"></span>
        </div>

        {/* Description */}
        <p className="quiz-intro-description">
          Let's put the insight, learning, and inspiration you've
          found here in the Hall of Zero Limits to work.
          To see what purpose may be calling, answer the
          following questions about your passions and
          preferences. Each has only two answers, so simply
          choose the answer that best applies to you. Go
          forth; the key to discovering your gift awaits.
        </p>

        {/* Begin Button */}
        <button className="quiz-begin-btn" onClick={onStart}>
          <span className="btn-corner tl"></span>
          <span className="btn-corner tr"></span>
          <span className="btn-corner bl"></span>
          <span className="btn-corner br"></span>
          <span className="btn-text">BEGIN QUIZ</span>
          <span className="btn-arrows">»</span>
          <span className="btn-line-bottom"></span>
        </button>
      </div>
    </motion.div>
  )
}

// Question Screen
function QuizQuestion({ 
  question, 
  questionIndex, 
  totalQuestions, 
  onAnswer, 
  onPrev,
  hoveredOption,
  setHoveredOption 
}) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [wakandaTexts] = useState(() => [generateWakandaText(), generateWakandaText()])

  const handleSelect = (optionIndex) => {
    setSelectedOption(optionIndex)
    // Delay to show selection animation
    setTimeout(() => {
      onAnswer(optionIndex)
      setSelectedOption(null)
    }, 400)
  }

  return (
    <motion.div
      className="quiz-question"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      {/* Question Header */}
      <div className="question-header">
        <span className="question-number">QUESTION {questionIndex + 1}</span>
        <h2 className="question-title">
          <span className="question-line1">{question.line1}</span>
          <span className="question-line2">{question.line2}</span>
        </h2>
      </div>

      {/* Options */}
      <div className="question-options">
        {/* Previous Button */}
        {onPrev && (
          <button className="quiz-prev-btn" onClick={onPrev}>
            <div className="prev-btn-hex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
                <polyline points="19 18 13 12 19 6" />
              </svg>
            </div>
            <span className="prev-line"></span>
            <span className="prev-text">PREV</span>
          </button>
        )}

        {question.options.map((option, index) => (
          <motion.div
            key={index}
            className={`quiz-option-card ${hoveredOption === index ? 'hovered' : ''} ${selectedOption === index ? 'selected' : ''}`}
            onMouseEnter={() => setHoveredOption(index)}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleSelect(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Card Frame */}
            <div className="option-card-frame">
              {/* Corner Dots */}
              <span className="option-corner top-left"></span>
              <span className="option-corner top-right"></span>
              <span className="option-corner bottom-left"></span>
              <span className="option-corner bottom-right"></span>

              {/* Diagonal Lines */}
              <span className="option-diagonal tl"></span>
              <span className="option-diagonal br"></span>

              {/* Scanline Effect */}
              <div className="option-scanlines"></div>

              {/* Content */}
              <div className="option-content">
                <span className="option-text">{option}</span>
                <span className="option-dot">○</span>
                <span className="option-wakanda">{wakandaTexts[index]}</span>
              </div>

              {/* Glow Overlay */}
              <div className="option-glow"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Click to Select Hint */}
      <div className="click-to-select">
        <span>CLICK TO SELECT</span>
        <span className="select-line"></span>
      </div>
    </motion.div>
  )
}

// Result Screen
function QuizResult({ result, showOther, setShowOther, onRetake, onContinue }) {
  const allResults = Object.values(QUIZ_RESULTS)
  const primaryResult = result.primary
  const secondaryResult = result.secondary

  // Calculate percentages for radar chart
  const chartData = useMemo(() => {
    const base = {
      'The Decoder': 0,
      'The Visionary': 0,
      'The Illuminator': 0,
      'The Avant-Garde': 0,
      'The Explorer': 0
    }
    
    // Primary gets highest percentage
    base[primaryResult.name] = result.scores[primaryResult.id] || 33
    // Secondary gets second highest
    base[secondaryResult.name] = result.scores[secondaryResult.id] || 25
    
    // Distribute remaining percentages
    const remaining = 100 - base[primaryResult.name] - base[secondaryResult.name]
    const otherTypes = allResults.filter(r => r.id !== primaryResult.id && r.id !== secondaryResult.id)
    otherTypes.forEach((type, i) => {
      base[type.name] = Math.round(remaining / otherTypes.length) - (i * 3)
    })
    
    return base
  }, [primaryResult, secondaryResult, result.scores, allResults])

  return (
    <motion.div
      className="quiz-result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Result Header */}
      <div className="result-header">
        <span className="result-label">QUIZ RESULTS</span>
        <p className="result-intro">
          You've reached the end of the quiz—and quite possibly the beginning of a
          new journey. The findings are like each of us: multi-dimensional. Go ahead,
          absorb them, and ask yourself to which path they may be pointing.
        </p>
      </div>

      {/* Main Result Content */}
      <div className="result-main-content">
        {/* Left Side - Primary Result */}
        <div className="result-primary">
          <div className="result-title-group">
            <span className="result-line-accent"></span>
            <div className="result-title-wrapper">
              <span className="result-the">THE</span>
              <h2 className="result-name">{primaryResult.name.replace('The ', '').toUpperCase()}</h2>
              <span className="result-wakanda">{generateWakandaText()}</span>
              <span className="result-dot">○</span>
            </div>
          </div>

          <p className="result-secondary-text">
            <span className="highlight">With underlying characteristics of</span> {secondaryResult.name}.
          </p>

          <p className="result-description">{primaryResult.description}</p>

          {/* Social Share */}
          <div className="result-share">
            <span className="share-label">SHARE YOUR GIFT WITH FRIENDS</span>
            <div className="share-buttons">
              <a 
                className="share-btn facebook" 
                href="https://www.facebook.com/Sprite/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                className="share-btn twitter" 
                href="https://x.com/Sprite?lang=en" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Radar Chart */}
        <div className="result-chart-section">
          <RadarChart data={chartData} primary={primaryResult.name} />
        </div>
      </div>

      {/* Other Characteristics Section */}
      <div className="result-other-section">
        <button 
          className="toggle-other-btn"
          onClick={() => setShowOther(!showOther)}
        >
          <span>Explore your other characteristics</span>
          <span className={`toggle-arrow ${showOther ? 'open' : ''}`}>∧</span>
        </button>

        <AnimatePresence>
          {showOther && (
            <motion.div
              className="other-characteristics"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Navigation Arrows */}
              <div className="other-nav-arrows">
                <button className="other-nav-btn prev">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                    <polyline points="19 18 13 12 19 6" />
                  </svg>
                </button>
                <button className="other-nav-btn next">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 6 15 12 9 18" />
                    <polyline points="5 6 11 12 5 18" />
                  </svg>
                </button>
              </div>

              {/* Characteristic Cards */}
              <div className="characteristic-cards">
                {allResults.filter(r => r.id !== primaryResult.id).map((char) => (
                  <CharacteristicCard 
                    key={char.id} 
                    characteristic={char} 
                    percentage={chartData[char.name]}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="result-actions">
        <button className="quiz-continue-btn" onClick={onContinue}>
          <span className="btn-corner tl"></span>
          <span className="btn-corner tr"></span>
          <span className="btn-corner bl"></span>
          <span className="btn-corner br"></span>
          <span className="btn-text">CONTINUE</span>
          <span className="btn-arrows">»</span>
          <span className="btn-line-bottom"></span>
        </button>

        <button className="quiz-retake-btn" onClick={onRetake}>
          <span>TAKE THE QUIZ AGAIN</span>
          <span className="retake-line"></span>
        </button>
      </div>
    </motion.div>
  )
}

// Radar Chart Component
function RadarChart({ data, primary }) {
  const types = Object.keys(data)
  const centerX = 150
  const centerY = 150
  const radius = 100
  const angleStep = (2 * Math.PI) / types.length

  // Calculate points for pentagon shape (outer)
  const outerPoints = types.map((_, i) => {
    const angle = -Math.PI / 2 + i * angleStep
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  })

  // Calculate data points
  const dataPoints = types.map((type, i) => {
    const angle = -Math.PI / 2 + i * angleStep
    const value = data[type] / 100
    return {
      x: centerX + radius * value * Math.cos(angle),
      y: centerY + radius * value * Math.sin(angle)
    }
  })

  const outerPath = outerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <div className="radar-chart-container">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Grid lines */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => {
          const points = types.map((_, j) => {
            const angle = -Math.PI / 2 + j * angleStep
            return {
              x: centerX + radius * scale * Math.cos(angle),
              y: centerY + radius * scale * Math.sin(angle)
            }
          })
          const path = points.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
          return (
            <path 
              key={i} 
              d={path} 
              fill="none" 
              stroke="rgba(0, 255, 136, 0.15)" 
              strokeWidth="1"
            />
          )
        })}

        {/* Axis lines */}
        {outerPoints.map((p, i) => (
          <line 
            key={i} 
            x1={centerX} 
            y1={centerY} 
            x2={p.x} 
            y2={p.y} 
            stroke="rgba(0, 255, 136, 0.15)" 
            strokeWidth="1"
          />
        ))}

        {/* Data shape */}
        <path 
          d={dataPath} 
          fill="rgba(0, 255, 136, 0.2)" 
          stroke="var(--neon-green)" 
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r="4" 
            fill="var(--neon-green)"
          />
        ))}
      </svg>

      {/* Labels */}
      {types.map((type, i) => {
        const angle = -Math.PI / 2 + i * angleStep
        const labelRadius = radius + 45
        const x = centerX + labelRadius * Math.cos(angle)
        const y = centerY + labelRadius * Math.sin(angle)
        const isPrimary = type === primary
        
        return (
          <div
            key={i}
            className={`chart-label ${isPrimary ? 'primary' : ''}`}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <span className="label-name">{type.toUpperCase()}</span>
            <span className="label-percent">{data[type]}%</span>
          </div>
        )
      })}
    </div>
  )
}

// Characteristic Card Component
function CharacteristicCard({ characteristic, percentage }) {
  return (
    <div className="characteristic-card">
      <div className="char-card-frame">
        {/* Corner Accents */}
        <span className="char-corner top-left"></span>
        <span className="char-corner top-right"></span>
        <span className="char-corner bottom-left"></span>
        <span className="char-corner bottom-right"></span>

        {/* Diagonal Lines */}
        <span className="char-diagonal tl"></span>
        <span className="char-diagonal br"></span>

        {/* Percentage */}
        <span className="char-percentage">{percentage}%</span>

        {/* Content */}
        <div className="char-content">
          <span className="char-the">THE</span>
          <h3 className="char-name">{characteristic.name.replace('The ', '').toUpperCase()}</h3>
          <span className="char-dot">○</span>
          <span className="char-wakanda">{generateWakandaText()}</span>
        </div>

        <p className="char-description">{characteristic.description}</p>
      </div>
    </div>
  )
}

// Footer Component
function QuizFooter({ phase, onKeepExploring }) {
  return (
    <footer className="quiz-footer">
      {phase === 'intro' && (
        <button className="keep-exploring-btn" onClick={onKeepExploring}>
          <span>OR KEEP EXPLORING FIRST</span>
          <span className="explore-line"></span>
        </button>
      )}

      <div className="quiz-footer-branding">
        {/* Sprite Logo */}
        <svg className="sprite-logo" width="60" height="30" viewBox="0 0 120 60" fill="none">
          <path 
            d="M60 5L75 15V45L60 55L45 45V15L60 5Z" 
            stroke="var(--neon-green)" 
            strokeWidth="1.5"
            fill="rgba(0, 255, 136, 0.1)"
          />
          <text 
            x="60" 
            y="35" 
            textAnchor="middle" 
            fill="var(--neon-green)" 
            fontSize="10"
            fontFamily="var(--font-display)"
            letterSpacing="1"
          >
            SPRITE
          </text>
        </svg>

        {/* Wakanda Forever Logo */}
        <div className="wakanda-logo">
          <div className="wakanda-marvel">MARVEL STUDIOS</div>
          <div className="wakanda-bp">BLACK PANTHER</div>
          <div className="wakanda-wf">WAKANDA FOREVER</div>
          <div className="wakanda-theaters">ONLY IN THEATERS</div>
        </div>

        <span className="footer-divider">|</span>
        <span className="footer-legal">Sprite Zero Sugar® | © MARVEL</span>
      </div>
    </footer>
  )
}


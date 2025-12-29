import { motion } from 'framer-motion'

export default function RoomInfo({ title, subtitle }) {
  return (
    <motion.div 
      className="room-info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="room-title">{title}</h2>
      <p className="room-subtitle">{subtitle}</p>
      <div className="room-divider" />
    </motion.div>
  )
}


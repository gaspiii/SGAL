// src/pages/Dashboard.jsx
import React, { useState } from 'react'
import UserSidebar from '../components/UserSidebar'
import TabHome from '../components/tabs/TabHome'
import TabSettings from '../components/tabs/TabSettings'
import { motion, AnimatePresence } from 'framer-motion'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home')

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <TabHome />
      case 'settings':
        return <TabSettings />
      default:
        return <TabHome />
    }
  }

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import TabHome from '../components/tabs/TabHome';
import TabQuotations from '../components/tabs/TabQuotations';
import TabRequests from '../components/tabs/TabRequests';
import TabSettings from '../components/tabs/TabSettings';
import TabUsers from '../components/tabs/TabUsers';
import TabGroups from '../components/tabs/TabGroups';
import TabClients from '../components/tabs/TabClients';
import TabHelp from '../components/tabs/TabHelp';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está logueado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <TabHome />;
      case 'quotes':
        switch (activeSubTab) {
          case 'quotations':
            return <TabQuotations />;
          case 'requests':
            return <TabRequests />;
          default:
            return <TabQuotations />;
        }
      case 'accounts':
        switch (activeSubTab) {
          case 'users':
            return <TabUsers />;
          case 'groups':
            return <TabGroups />;
          case 'clients':
            return <TabClients />;
          default:
            return <TabUsers />;
        }
      case 'settings':
        return <TabSettings />;
      case 'help':
        return <TabHelp />;
      default:
        return <TabHome />;
    }
  };

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      <UserSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeSubTab || '')}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;

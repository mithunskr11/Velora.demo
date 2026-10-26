import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { TopHeader } from './components/layout/TopHeader';

// Modals
import { QuickActionModal } from './components/modals/QuickActionModal';
import { AddHabitModal } from './components/modals/AddHabitModal';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { BadgeCelebrationModal } from './components/modals/BadgeCelebrationModal';
import { CameraModal } from './components/snap/CameraModal';
import { StoryViewerModal } from './components/snap/StoryViewerModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { HomePage } from './pages/HomePage';
import { HabitsPage } from './pages/HabitsPage';
import { CheckInPage } from './pages/CheckInPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CoachPage } from './pages/CoachPage';
import { MapPage } from './pages/MapPage';
import { CommunityPage } from './pages/CommunityPage';
import { InboxPage } from './pages/InboxPage';
import { ProfilePage } from './pages/ProfilePage';
import { EcoPage } from './pages/EcoPage';
import { ProgressPage } from './pages/ProgressPage';
import { MonthlyUpdatePage } from './pages/MonthlyUpdatePage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { 
    currentRoute, 
    quickActionOpen, 
    setQuickActionOpen, 
    activeBadgeCelebration, 
    dismissBadgeCelebration,
    cameraOpen,
    closeCamera
  } = useApp();

  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Standalone pages without application layout
  if (currentRoute === '/') {
    return <LandingPage />;
  }
  if (currentRoute === '/login') {
    return <LoginPage />;
  }
  if (currentRoute === '/signup') {
    return <SignupPage />;
  }
  if (currentRoute === '/onboarding') {
    return <OnboardingPage />;
  }
  if (currentRoute === '/profile-setup') {
    return <ProfileSetupPage />;
  }

  // Dashboard & Application Pages
  const renderCurrentPage = () => {
    if (currentRoute === '/home') {
      return <HomePage onOpenAddHabit={() => setAddHabitOpen(true)} />;
    }
    if (currentRoute === '/habits') {
      return <HabitsPage onOpenAddHabit={() => setAddHabitOpen(true)} />;
    }
    if (currentRoute === '/check-in') {
      return <CheckInPage />;
    }
    if (currentRoute === '/recommendations') {
      return <RecommendationsPage />;
    }
    if (currentRoute === '/coach') {
      return <CoachPage />;
    }
    if (currentRoute === '/map' || currentRoute.startsWith('/activity/')) {
      return <MapPage onOpenProofModal={() => setCreatePostOpen(true)} />;
    }
    if (currentRoute.startsWith('/community')) {
      return <CommunityPage onOpenCreatePost={() => setCreatePostOpen(true)} />;
    }
    if (currentRoute.startsWith('/profile/')) {
      return <ProfilePage />;
    }
    if (currentRoute === '/inbox' || currentRoute.startsWith('/inbox/')) {
      return <InboxPage />;
    }
    if (currentRoute === '/eco') {
      return <EcoPage />;
    }
    if (currentRoute === '/progress') {
      return <ProgressPage />;
    }
    if (currentRoute === '/monthly-update') {
      return <MonthlyUpdatePage />;
    }
    if (currentRoute === '/rewards') {
      return <RewardsPage />;
    }
    if (currentRoute === '/settings') {
      return <SettingsPage />;
    }

    // Default fallback to Home
    return <HomePage onOpenAddHabit={() => setAddHabitOpen(true)} />;
  };

  return (
    <div className="flex min-h-screen bg-[#F4FAF5] dark:bg-[#102A24] text-[#173B32] dark:text-[#F4FAF5] transition-colors">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <TopHeader onOpenSearch={() => setSearchOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation with center floating + button */}
      <MobileNav />

      {/* Global Interactive Modals */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        onOpenAddHabit={() => setAddHabitOpen(true)}
        onOpenCreatePost={() => setCreatePostOpen(true)}
      />

      <AddHabitModal
        isOpen={addHabitOpen}
        onClose={() => setAddHabitOpen(false)}
      />

      <CreatePostModal
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
      />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <BadgeCelebrationModal
        badge={activeBadgeCelebration}
        onClose={dismissBadgeCelebration}
      />

      {/* Full-Screen Camera Interface & Photo Editor */}
      <CameraModal
        isOpen={cameraOpen}
        onClose={closeCamera}
      />

      {/* 24-Hour Story Full-Screen Viewer */}
      <StoryViewerModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

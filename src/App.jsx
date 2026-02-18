import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProgress } from './hooks/useProgress';
import MainLayout from './layouts/MainLayout';
// import SplashScreen from './pages/SplashScreen'; // Removing SplashScreen as auth flow takes precedence
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import LogReading from './pages/LogReading';

import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import ReloadPrompt from './components/ReloadPrompt';

export default function App() {
  const {
    progress,
    completeOnboarding,
    logReading,
    quickCompleteToday,
    getTodayTarget,
    getDailyTarget,
    getPercentage,
    getConsistency,
    isTodayComplete,
    resetProgress,
    updateSettings,
  } = useProgress();

  return (
    <BrowserRouter>
      <ReloadPrompt />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding onComplete={completeOnboarding} />} />

        {/* Protected Routes */}
        <Route
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                progress={progress}
                getPercentage={getPercentage}
                getTodayTarget={getTodayTarget}
                getDailyTarget={getDailyTarget}
                isTodayComplete={isTodayComplete}
                quickCompleteToday={quickCompleteToday}
              />
            }
          />
          <Route
            path="/progress"
            element={
              <Progress
                progress={progress}
                getPercentage={getPercentage}
                getConsistency={getConsistency}
              />
            }
          />
          <Route
            path="/log"
            element={
              <LogReading
                progress={progress}
                logReading={logReading}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings
                progress={progress}
                updateSettings={updateSettings}
                resetProgress={resetProgress}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

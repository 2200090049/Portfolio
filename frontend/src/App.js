import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { SettingsProvider } from './context/SettingsContext';
import { SiteProvider, useSite } from './context/SiteContext';
import { AdminProvider } from './contexts/AdminContext';
import client from './apollo/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const LoadingScreen = lazy(() => import('./components/LoadingScreen'));
const ThemeApplier = lazy(() => import('./components/ThemeApplier'));
const Analytics = lazy(() => import('./components/Analytics'));
const MaintenancePage = lazy(() => import('./components/MaintenancePage'));

// New Admin Pages (Hidden Route)
const NewAdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const NewAdminRegister = lazy(() => import('./pages/admin/AdminRegister'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProtectedAdminRoute = lazy(() => import('./components/ProtectedAdminRoute'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { selectedRole } = usePortfolio();
  
  if (!selectedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Feature-based Route Protection
const FeatureRoute = ({ children, feature }) => {
  const { siteSettings } = useSite();
  const { selectedRole } = usePortfolio();
  
  // Check if role is selected
  if (!selectedRole) {
    return <Navigate to="/" replace />;
  }
  
  // Check if feature is enabled
  if (feature && siteSettings.features && !siteSettings.features[feature]) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Layout with Navbar and Footer
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

// Maintenance Mode Wrapper
const MaintenanceWrapper = ({ children }) => {
  const { siteSettings, loading } = useSite();
  const location = window.location;
  
  // Don't show maintenance mode while loading
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Allow admin routes to bypass maintenance mode
  const isAdminRoute = location.pathname.startsWith('/portal-dk-sys-2025');
  
  // Show maintenance page if enabled and not on admin route
  if (siteSettings.maintenanceMode && !isAdminRoute) {
    return <MaintenancePage message={siteSettings.maintenanceMessage} />;
  }
  
  return children;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <SiteProvider>
        <SettingsProvider>
          <PortfolioProvider>
            <Router>
              <AdminProvider>
                <ThemeApplier />
                <Analytics />
                <MaintenanceWrapper>
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                {/* Landing page - no role selection required */}
                <Route path="/" element={<Landing />} />
                
                {/* Protected routes - require role selection */}
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Layout><Home /></Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects" element={
                  <FeatureRoute feature="showProjects">
                    <Layout><Projects /></Layout>
                  </FeatureRoute>
                } />
                
                <Route path="/about" element={
                  <ProtectedRoute>
                    <Layout><About /></Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/contact" element={
                  <FeatureRoute feature="showContact">
                    <Layout><Contact /></Layout>
                  </FeatureRoute>
                } />
                
                <Route path="/blog" element={
                  <FeatureRoute feature="showBlog">
                    <Layout><Blog /></Layout>
                  </FeatureRoute>
                } />
                
                <Route path="/blog/:slug" element={
                  <FeatureRoute feature="showBlog">
                    <Layout><BlogPost /></Layout>
                  </FeatureRoute>
                } />
                
                {/* NEW Hidden Admin Routes - GOD MODE PORTAL 🔐 */}
                <Route path="/portal-dk-sys-2025/login" element={<NewAdminLogin />} />
                <Route path="/portal-dk-sys-2025/register" element={<NewAdminRegister />} />
                
                {/* Protected Admin Dashboard - GOD MODE */}
                <Route path="/portal-dk-sys-2025/dashboard/*" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
                
                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          </MaintenanceWrapper>
            </AdminProvider>
          </Router>
        </PortfolioProvider>
      </SettingsProvider>
    </SiteProvider>
  </ApolloProvider>
  );
}

export default App;

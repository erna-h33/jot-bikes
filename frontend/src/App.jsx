import { Outlet, useLocation } from 'react-router-dom';
import TopNavigation from './components/TopNavigation';
// import Navigation from './pages/Auth/Navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chatbot from './components/Chatbot';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminPage && !isProfilePage && <TopNavigation />}
      <ToastContainer />
      {/* <Navigation /> */}
      <main className={isAdminPage ? '' : isHomePage ? '' : 'pt-20'}>
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
}

export default App;

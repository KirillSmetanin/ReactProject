import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { Main } from './components/main/main';
import { Reg } from './components/Reg/Reg';
import { Auf } from './components/Auf/Auf';
import { Kp } from "./components/KP/kp";
import { Profile } from "./components/Profile/profile";
import { Create } from "./components/Create/create";
import { ProjectDetails } from "./components/ProjectDetails/projectdetails";
import { Sbor } from "./components/Sbor/sbor"
import { Wishes } from "./components/Wishes/wishes"
import { People } from "./components/People/people"
import { Work } from "./components/Work/work"
import { Med } from "./components/Med/med"
import { Admin } from './components/Admin/admin';
import { DataView } from './components/Admin/DataView';
import { PageDetails } from './components/PageDetails/PageDetails';
import './styles.css';

// Компонент для защиты маршрутов
const ProtectedAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('/api/auth/check-admin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) return <div>Проверка прав доступа...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return children;
};

const App = () => {
    return (
        <Router>
            <div className="container">
                <Header />
                <div className="content">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/register" element={<Reg />} />
                    <Route path="/login" element={<Auf />} />
                    <Route path="/kp" element={<Kp />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/project/:projectId" element={<ProjectDetails />} />
                    <Route path="/sbor" element={<Sbor />} />
                    <Route path="/wishes" element={<Wishes />} />
                    <Route path="/people" element={<People />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/med" element={<Med />} />
                    <Route path="/pages/:id" element={<PageDetails />} />

                    {/* Защищенные админские маршруты */}
                    <Route path="/admin" element={
                    <ProtectedAdminRoute>
                        <Admin />
                    </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/data-view" element={
                    <ProtectedAdminRoute>
                        <DataView />
                    </ProtectedAdminRoute>
                    } />

                    <Route path="*" element={<h1>404 Not Found</h1>} />
                    
                </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;


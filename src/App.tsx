import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PostsList from "./pages/PostsList";
import PostEditor from "./pages/PostEditor";
import ProjectsManager from "./pages/ProjectsManager";
import DownloadsManager from "./pages/DownloadsManager";
import CategoriesManager from "./pages/CategoriesManager";
import MediaLibrary from "./pages/MediaLibrary";
import YouTubeManager from "./pages/YouTubeManager";
import Subscribers from "./pages/Subscribers";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Backup from "./pages/Backup";

function Admin({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Admin><Dashboard /></Admin>} />
        <Route path="/posts" element={<Admin><PostsList /></Admin>} />
        <Route path="/posts/:id" element={<Admin><PostEditor /></Admin>} />
        <Route path="/projects" element={<Admin><ProjectsManager /></Admin>} />
        <Route path="/downloads" element={<Admin><DownloadsManager /></Admin>} />
        <Route path="/categories" element={<Admin><CategoriesManager /></Admin>} />
        <Route path="/media" element={<Admin><MediaLibrary /></Admin>} />
        <Route path="/videos" element={<Admin><YouTubeManager /></Admin>} />
        <Route path="/subscribers" element={<Admin><Subscribers /></Admin>} />
        <Route path="/settings" element={<Admin><Settings /></Admin>} />
        <Route path="/backup" element={<Admin><Backup /></Admin>} />
        <Route path="/profile" element={<Admin><Profile /></Admin>} />
      </Routes>
    </AuthProvider>
  );
}

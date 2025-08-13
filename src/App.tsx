import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LanguageSelection from './components/LanguageSelection';
import WarningPage from './components/WarningPage';
import AllergenSelectionPage from './components/AllergenSelectionPage';
import MainPage from './components/MainPage';
import DishDetail from './components/DishDetail';
import CategoryPage from './components/CategoryPage';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import HistoryPage from './components/HistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanguageSelection />} />
        <Route path="/languages" element={<LanguageSelection />} />
        <Route path="/:language" element={<WarningPage />} />
        <Route path="/:language/allergens" element={<AllergenSelectionPage />} />
        <Route path="/:language/menu" element={<MainPage />} />
        <Route path="/:language/category/:category" element={<CategoryPage />} />
        <Route path="/:language/dish/:dishId" element={<DishDetail />} />
        <Route path="/administration" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/history" element={<HistoryPage />} />
        {/* Rediriger toutes les autres routes vers le choix des langues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
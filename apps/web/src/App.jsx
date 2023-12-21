import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import ManageCategories from './pages/manage/category/ManageCategories';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage/category" element={<ManageCategories />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

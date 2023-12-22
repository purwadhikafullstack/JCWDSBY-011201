import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Cart from './pages/cart';

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto max-w-sm h-[100svh] font-roboto">
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

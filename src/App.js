import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import './App.css';
import { TabelaKursowa } from './TabelaKursowa'
import { CenaZlota } from './CenaZlota'
import { Autor } from './Autor'
import { Waluta } from './Waluta';

export default function App() {
  return (
    <BrowserRouter>
        <nav>
          <Link to="/">Strona główna</Link> |{" "}
          <Link to="/tabela-kursowa">Tabela kursowa</Link> |{" "}
          <Link to="/cena-zlota">Cena złota</Link> |{" "}
          <Link to="/autor">Autor</Link>
        </nav>
      <Routes>
        <Route path="/" />
        <Route path="/tabela-kursowa" element={<TabelaKursowa />} />
        <Route path="/cena-zlota" element={<CenaZlota />} />
        <Route path="/autor" element={<Autor />} />
        <Route path="/tabela-kursowa/:waluta" element={<Waluta />} />
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { ThemeToggle } from './components/ThemeToggle'
import { Home } from './pages/Home'
import { Detail } from './pages/Detail'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <BrowserRouter>
      <ThemeToggle theme={theme} toggle={toggle} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Detail theme={theme} />} />
      </Routes>
    </BrowserRouter>
  )
}

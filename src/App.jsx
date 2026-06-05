import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import NewAssessment from './pages/NewAssessment'
import Report from './pages/Report'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assess" element={<NewAssessment />} />
        <Route path="/report/:id" element={<Report />} />
      </Routes>
    </Layout>
  )
}

import './App.css'
import Notes from "./pages/Notes";
import Resources from "./pages/Resources";
import Assignments from "./pages/Assignments";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Sidebar from './components/Sidebar'

import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import StudyPlanner from './pages/StudyPlanner'
import Attendance from './pages/Attendance'
import Subjects from './pages/Subjects'
import Analytics from './pages/Analytics'
import SubjectWorkspace from './pages/SubjectWorkspace'
import Growth from "./pages/Growth";

function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Sidebar />

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/planner"
            element={<StudyPlanner />}
          />

          <Route
            path="/growth"
            element={<Growth />}
          />

          <Route
            path="/subjects"
            element={<Subjects />}
          />

          <Route
            path="/subjects/:id"
            element={<SubjectWorkspace />}
          />

          <Route
            path="/notes/:id"
            element={<Notes />}
          />

          <Route
            path="/resources/:id"
            element={<Resources />}
          />

          <Route
            path="/assignments/:id"
            element={<Assignments />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  )
}

export default App
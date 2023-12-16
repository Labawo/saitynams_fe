import Register from './components/Authorization/Register';
import Login from './components/Authorization/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Editor from './components/Editor';
import Admin from './components/Users/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Authorization/Unauthorized';
import Lounge from './components/Lounge';
import TherapiesPage from './components/Therapies/TherapiesPage';
import TherapyPage from './components/Therapies/TherapyPage';
import RequireAuth from './components/Authorization/RequireAuth';
import { Routes, Route } from 'react-router-dom';

const ROLES = {
  'User': "Patient",
  'Editor': "Doctor",
  'Admin': "Admin"
}

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/therapies" element={<TherapiesPage />} />
          <Route path="/therapies/:therapyId" element={<TherapyPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path="editor" element={<Editor />} />
        </Route>


        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
          <Route path="lounge" element={<Lounge />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
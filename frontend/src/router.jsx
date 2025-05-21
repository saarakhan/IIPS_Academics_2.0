import { createBrowserRouter } from 'react-router-dom';
import SignUp from './components/SignUp/SIgnUp';
import SignIn from './components/SignIn/SignIn';
import Dashboard from './routes/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import SubjectDetail from './components/academics/SubjectDetail/SubjectDetail';
import Subject from './components/academics/Subject/Subject';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Subject /> },
      { path: 'subject/:id', element: <SubjectDetail /> },
    ],
  },
  { path: '/signup', element: <SignUp /> },
  { path: '/signin', element: <SignIn /> },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

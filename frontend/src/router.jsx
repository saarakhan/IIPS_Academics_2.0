import { createBrowserRouter } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';

import SubjectDetail from './components/academics/SubjectDetail';
import Subject from './components/academics/Subject';

import App from './App';
import Dashboard from "./Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute/PrivateRoute";

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


export default router;

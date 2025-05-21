import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignIn from "./components/SignIn/SignIn";
// import Subject from "./components/academics/Subject"
// import { AuthContextProvider } from "./Context/AuthContext";

function App() {
  return (
    <>
      {/* <AuthContextProvider> */}
      <Navbar />
      <Outlet />
      {/* <Routes>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/academics" element={<Subject />}></Route>
          </Routes> */}
      {/* </AuthContextProvider> */}
    </>
  );
}

export default App;

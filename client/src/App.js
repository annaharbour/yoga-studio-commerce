import './App.css';
import Nav from './components/Nav'
import Footer from './components/Footer'
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';


function App() {
  
  return (
    <>
      <ToastContainer/>
      <Nav/>
      <Outlet/>
      <Footer/>
    </>
  );
}

export default App;

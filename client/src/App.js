import './App.css';
import Nav from './components/Nav'
import Footer from './components/Footer'
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  
  return (
    <div className='App'>
      
      <Nav/>
      <Outlet/>
      <ToastContainer position="top-right" autoClose={2000} theme="dark"
     />
      <Footer/>
     
    </div>
  );
}

export default App;

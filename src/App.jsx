import AppRoute from "./routers/AppRouter";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <ToastContainer />
      <AppRoute />
    </>
  )
}
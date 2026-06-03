import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>

            <Route path="/register" element={<Register/>}/>

            <Route path="/" element={
               <ProtectedRoute>
            <Home />
          </ProtectedRoute>
            }
            />
        </Routes>
    );
}
export default AppRoutes;
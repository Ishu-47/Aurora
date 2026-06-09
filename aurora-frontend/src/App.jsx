import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from 'react-hot-toast';

import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
          />

          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
import Welcome from "./Components/Welcome";
import FotoBooth from "./Components/Fotobooth";
import FormContact from "./Components/FormContact";
import Trivia from "./Components/Trivia";
import ImageQr from "./Components/ImageQR";
import ClickPhotobooth from "./Components/ClickPhotobooth";
import { useRoutes, BrowserRouter } from "react-router-dom";
import "./App.css";

function AppRoutes() {
  const routes = useRoutes([
    { path: "/clickPhoto", element: <ClickPhotobooth /> },
    { path: "/", element: <Welcome /> },
    {path: "/trivia", element: <Trivia />},
    { path: "/photo", element: <FotoBooth /> },
    { path: "/contact", element: <FormContact /> },
    { path: "/qr", element: <ImageQr /> }
   
  ]);
  return routes;
}

function App() {
  return (
    <BrowserRouter >
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

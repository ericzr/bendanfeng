import { BrowserRouter, Routes } from "react-router";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <BrowserRouter basename="/bendanfeng">
      <Routes>{AppRoutes()}</Routes>
    </BrowserRouter>
  );
}

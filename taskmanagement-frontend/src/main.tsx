import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login.tsx";
import GetStarted from "./pages/GetStarted.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </>
);

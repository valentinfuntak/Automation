import { HashRouter, Route } from "@solidjs/router";
import { AuthProvider } from "../src/Auth/AuthProvider.jsx";

import MainLayout from "../src/Layout/MainLayout.jsx";
import Auth from "../src/Layout/Autentification.jsx";

import SignUp from "../src/Pages/SignUp.jsx"
import SignIn from "../src/Pages/SignIn.jsx"
import Home from "../src/Pages/Home.jsx"
import Settings from "./Pages/Settings.jsx";
import Programs from "./Pages/Programs.jsx";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Route path="/" component={() => (<Auth><SignUp /></Auth>)} />
        <Route path="/SignIn" component={() => (<Auth><SignIn /></Auth>)} />
        <Route path="/Home" component={() => (<MainLayout><Home /></MainLayout>)} />
        <Route path="/Home/Programs" component={() => (<MainLayout><Programs /></MainLayout>)} />
        <Route path="/Home/Settings" component={() => (<MainLayout><Settings /></MainLayout>)} />
      </HashRouter>
    </AuthProvider>
  );
}
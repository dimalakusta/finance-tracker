import {
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import {
  Home,
  List,
  BarChart3,
  Settings,
} from "lucide-react";

import HomePage from "./pages/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

import BottomNav from "./Components/BottomNav";

import {
  useSettings,
} from "./context/SettingsContext";

import {
  translations,
} from "./utils/translations";


export default function App() {
  const {
    language,
  } = useSettings();


  const t =
    translations[language];


  const links = [
    {
      path: "/",
      label: t.home,
      icon: Home,
    },
    {
      path: "/transactions",
      label: t.transactions,
      icon: List,
    },
    {
      path: "/analytics",
      label: t.analytics,
      icon: BarChart3,
    },
    {
      path: "/settings",
      label: t.settings,
      icon: Settings,
    },
  ];


  return (
    <>

      <header className="top-navigation">

        <div className="top-navigation-inner">

          <div className="app-logo">

            <div className="app-logo-icon">
              ₴
            </div>

            <span>
              Finance Tracker
            </span>

          </div>


          <nav className="desktop-navigation">

            {links.map((link) => {
              const Icon =
                link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={
                    link.path === "/"
                  }
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >

                  <Icon size={18} />

                  <span>
                    {link.label}
                  </span>

                </NavLink>
              );
            })}

          </nav>

        </div>

      </header>


      <main className="app-content">

        <Routes>

          <Route
            path="/"
            element={
              <HomePage />
            }
          />

          <Route
            path="/transactions"
            element={
              <TransactionsPage />
            }
          />

          <Route
            path="/analytics"
            element={
              <AnalyticsPage />
            }
          />

          <Route
            path="/settings"
            element={
              <SettingsPage />
            }
          />

        </Routes>

      </main>


      <BottomNav />

    </>
  );
}
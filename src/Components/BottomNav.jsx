import {
  NavLink,
} from "react-router-dom";

import {
  Home,
  List,
  BarChart3,
  Settings,
} from "lucide-react";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  translations,
} from "../utils/translations";


export default function BottomNav() {
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
    <nav className="bottom-navigation">

      {links.map(
        (link) => {
          const Icon =
            link.icon;

          return (
            <NavLink
              key={
                link.path
              }
              to={
                link.path
              }
              end={
                link.path ===
                "/"
              }
              className={({
                isActive,
              }) =>
                isActive
                  ? "bottom-nav-link active"
                  : "bottom-nav-link"
              }
            >
              <Icon
                size={21}
              />

              <span>
                {link.label}
              </span>
            </NavLink>
          );
        }
      )}

    </nav>
  );
}
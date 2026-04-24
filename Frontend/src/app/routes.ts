import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { Transactions } from "./components/Transactions";
import { Budgets } from "./components/Budgets";
import { Analytics } from "./components/Analytics";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "transactions", Component: Transactions },
      { path: "budgets", Component: Budgets },
      { path: "analytics", Component: Analytics },
    ],
  },
]);

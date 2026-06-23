import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./layout";
import { Home } from "./pages/Home";
import { SubmitForm } from "./pages/SubmitForm";
import { ApplicationDetail } from "./pages/ApplicationDetail";
import { ApplicationList } from "./pages/ApplicationList";

import { StaffApproval } from "./pages/StaffApproval";
import { StaffApprovalList } from "./pages/StaffApprovalList";
import { SystemSettings } from "./pages/SystemSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "submit-form", Component: SubmitForm },
      { path: "application-detail", Component: ApplicationDetail },
      { path: "application-list", Component: ApplicationList },
      { path: "staff-approval", Component: StaffApproval },
      { path: "staff-approval-list", Component: StaffApprovalList },
      { path: "system-settings", Component: SystemSettings },
      { path: "*", Component: () => <Navigate to="/" replace /> },
    ],
  },
]);
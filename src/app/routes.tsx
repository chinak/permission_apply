import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./layout";
import { Home } from "./pages/Home";
import { SubmitForm } from "./pages/SubmitForm";
import { ApplicationDetail } from "./pages/ApplicationDetail";
import { ApplicationList } from "./pages/ApplicationList";

import { StaffApproval } from "./pages/StaffApproval";
import { StaffApprovalList } from "./pages/StaffApprovalList";
import { SystemSettings } from "./pages/SystemSettings";

import { WarehouseApply } from "./pages/WarehouseApply";
import { WarehouseList } from "./pages/WarehouseList";
import { WarehouseDetail } from "./pages/WarehouseDetail";
import { WarehouseAudit } from "./pages/WarehouseAudit";
import { WarehouseAuditList } from "./pages/WarehouseAuditList";
import { Protocols } from "./pages/Protocols";
import { Templates } from "./pages/Templates";
import { Varieties } from "./pages/Varieties";
import { VarietyPermissionTab } from "./pages/VarietyPermissionTab";
import { CancelPermission } from "./pages/CancelPermission";

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
      { path: "warehouse-apply", Component: WarehouseApply },
      { path: "warehouse-list", Component: WarehouseList },
      { path: "warehouse-detail", Component: WarehouseDetail },
      { path: "warehouse-audit", Component: WarehouseAudit },
      { path: "warehouse-audit-list", Component: WarehouseAuditList },
      { path: "protocols", Component: Protocols },
      { path: "templates", Component: Templates },
      { path: "varieties", Component: Varieties },
      { path: "variety-permission", Component: VarietyPermissionTab },
      { path: "cancel-permission", Component: CancelPermission },
      { path: "*", Component: () => <Navigate to="/" replace /> },
    ],
  },
]);
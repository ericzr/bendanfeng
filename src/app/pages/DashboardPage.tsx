import { Navigate } from "react-router";

/**
 * @deprecated 此页面已重构为嵌套路由结构。
 * 所有 dashboard 子视图现在由 /dashboard/* 路由直接处理，
 * 布局由 DashboardLayout 提供。
 *
 * 保留此文件仅供旧引用的兼容重定向。
 */
export function DashboardPage() {
  return <Navigate to="/dashboard/brain" replace />;
}

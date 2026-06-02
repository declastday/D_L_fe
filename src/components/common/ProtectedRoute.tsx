import { Outlet } from "react-router-dom";

export function ProtectedRoute() {
  // 프로토타입 단계에서는 모든 페이지 접근을 허용합니다.
  return <Outlet />;
}

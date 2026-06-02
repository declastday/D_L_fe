import { Outlet } from "react-router-dom";

/**
 * 관리자 페이지 접근 제어 래퍼(프로토타입 단계에서는 일단 항상 통과).
 * 이후 관리자 로그인/권한 정책이 정해지면 여기에서만 라우팅 로직을 교체하면 됩니다.
 */
export function AdminRoute() {
  return <Outlet />;
}


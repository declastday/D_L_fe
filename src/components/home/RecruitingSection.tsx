import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Laptop,
  Palette,
  BookOpen,
  Camera,
  Utensils,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { MoreLink } from "@/components/common/MoreLink";

/**
 * 모집중인 동아리 및 분과별 소개 섹션 컴포넌트
 * - 현재 모집 기간인 동아리 목록을 하이라이트하여 보여줍니다.
 * - 우측에는 분과별 통계 및 카테고리 바로가기를 제공합니다.
 */
export function RecruitingSection() {
  const navigate = useNavigate();
  // 모집중인 동아리 임시 데이터
  const recruitingClubs = [
    {
      id: 1,
      title: "디스토션",
      category: "공연",
      endDate: "2023.09.26",
      deadlineText: "",
      image: "/images/performence.jpg",
      textColor: "text-white",
    },
    {
      id: 2,
      title: "RCY",
      category: "봉사",
      endDate: "2025.09.26",
      deadlineText: "",
      image: "/images/rcy_v1.jpg",
      textColor: "text-white",
    },
    {
      id: 3,
      title: "사진예술연구회",
      category: "교양",
      endDate: "2025.09.26",
      deadlineText: "",
      image: "/images/photo_exhibition_v1.png", // ← 이미지 추가!
      textColor: "text-white",
    },
    {
      id: 4,
      title: "스매시",
      category: "체육",
      endDate: "2025.09.28",
      deadlineText: "",
      image: "/images/smash.jpg", // ← 이미지 추가!
      textColor: "text-white",
    },
    {
      id: 5,
      title: "유스호스텔",
      category: "교양",
      endDate: "2025.09.26",
      deadlineText: "",
      image: "/images/hostel.jpg", // ← 이미지 추가!
      textColor: "text-white",
    },
    {
      id: 6,
      title: "CPR",
      category: "학술",
      endDate: "상시모집",
      deadlineText: "모집예정",
      image: "/images/cpr_v1.png",
      textColor: "text-white",
    },
  ];

  // 분과별 동아리 수 데이터
  const divisions = [
    { name: "공연", count: 12 },
    { name: "교양", count: 8 },
    { name: "봉사", count: 6 },
    { name: "종교사회", count: 4 },
    { name: "체육", count: 15 },
    { name: "학술", count: 9 },
  ];

  // 카테고리(태그)별 데이터 및 아이콘
  const categories = [
    { name: "프로그래밍", count: 15, icon: Laptop },
    { name: "디자인", count: 12, icon: Palette },
    { name: "음악", count: 18, icon: Music },
    { name: "독서토론", count: 9, icon: BookOpen },
    { name: "운동", count: 22, icon: Trophy },
    { name: "요리", count: 8, icon: Utensils },
    { name: "사진", count: 14, icon: Camera },
    { name: "영상편집", count: 10, icon: Camera },
    { name: "웹개발", count: 16, icon: Laptop },
    { name: "댄스", count: 17, icon: Music },
  ];

  return (
    <div className="flex flex-col">
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          모집중인 동아리
        </h2>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          분과별 모아보기
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-12 w-full mx-auto">
        {/* 좌측 영역 */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recruitingClubs.map((club) => (
              <Card
                key={club.id}
                className={cn(
                  club.textColor,
                  // 세로형 카드(2:3보다 낮은 비율 — 약 4:5로 높이 완화)
                  "relative aspect-[4/5] w-full overflow-hidden border-none py-0 gap-0 shadow-sm",
                  "group cursor-pointer",
                  "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                )}
                onClick={() => navigate(`/club/${club.id}`)}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110",
                  )}
                  style={{
                    backgroundImage: `url(${club.image})`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <CardContent className="relative z-10 flex h-full min-h-0 flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-primary/90 text-primary-foreground border-none py-1 px-3 backdrop-blur-sm">
                      {club.category}
                    </Badge>
                    {club.deadlineText && (
                      <Badge
                        variant="secondary"
                        className="bg-secondary/90 text-secondary-foreground border-none py-1 px-3 backdrop-blur-sm"
                      >
                        {club.deadlineText}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 drop-shadow-md">
                      {club.title}
                    </h3>
                    <p className="text-sm opacity-90 drop-shadow-sm">
                      {club.endDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 우측 사이드바: 분과별 정보 및 태그 — lg에서 높이를 포스터 열과 맞추고 태그를 하단 정렬 */}
        <aside className="flex w-full shrink-0 flex-col gap-6 sm:gap-8 lg:w-96 lg:self-stretch lg:min-h-0">
          <div className="space-y-4">
            {divisions.map((division) => (
              <div
                key={division.name}
                className="flex justify-between items-center group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
              >
                <span className="text-gray-700 font-medium group-hover:text-gray-900">
                  {division.name}
                </span>
                <MoreLink className="text-gray-400 group-hover:text-gray-600">
                  {division.count}개 동아리
                </MoreLink>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className={cn(
              "w-full h-12 shrink-0",
              "text-gray-700 border-border",
              "hover:bg-gray-50 hover:text-gray-900",
              "cursor-pointer",
            )}
            asChild
          >
            <Link to="/clubs">전체 동아리</Link>
          </Button>

          <div className="mt-auto flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2",
                    "bg-white border border-gray-100 rounded-lg shadow-sm",
                    "hover:shadow-md hover:border-gray-200 transition-all cursor-pointer",
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                >
                  <cat.icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400">{cat.count}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <MoreLink className="text-gray-400 hover:text-gray-700">
                모든 태그 보기
              </MoreLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

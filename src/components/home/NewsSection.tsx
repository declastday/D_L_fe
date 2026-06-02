import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar } from "lucide-react";
import { MoreLink } from "@/components/common/MoreLink";

/**
 * 뉴스 아이템 데이터 인터페이스
 */
interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl: string;
  comments: number;
}

/**
 * 임시 뉴스 데이터
 */
const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    title: "2026년도 1학기 동아리 등록 기간 안내",
    description:
      "새로운 학기를 맞아 동아리 등록/재등록 기간이 시작되었습니다. 기간 내에 신청서를 제출해주세요.",
    date: "2026.03.02",
    category: "공지사항",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
    comments: 12,
  },
  {
    id: 2,
    title: "제5회 드림라운지 연합 해커톤 개최 결과 발표",
    description:
      "지난 주말 진행된 연합 해커톤의 수상팀을 발표합니다. 참여해주신 모든 분들께 감사드립니다.",
    date: "2026.02.28",
    category: "행사",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    comments: 8,
  },
  {
    id: 3,
    title: "신규 동아리실 배정 결과 및 이용 수칙 안내",
    description:
      "2026년도 동아리실 배정 결과가 발표되었습니다. 각 동아리 대표자분들은 확인 부탁드립니다.",
    date: "2026.02.25",
    category: "공지사항",
    imageUrl:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
    comments: 5,
  },
  {
    id: 4,
    title: "봄맞이 동아리 거리 공연 일정 안내",
    description: "따뜻한 봄날 캠퍼스 곳곳에서 펼쳐지는 예쁜 선율을 즐겨보세요.",
    date: "2026.03.10",
    category: "공연",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
    comments: 24,
  },
];

/**
 * 뉴스 섹션 컴포넌트
 * - 동아리 관련 최신 뉴스 및 공지사항을 그리드 형태로 노출합니다.
 * - 첫 번째 아이템은 크게 강조하고, 나머지는 리스트 형태로 보여줍니다.
 */
export function NewsSection() {
  const [mainNews, ...otherNews] = NEWS_ITEMS;

  if (!mainNews) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-12 w-full mx-auto">
      {/* 섹션 헤더: 제목 및 전체보기 링크 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">동아리 뉴스</h2>
        </div>
        <MoreLink>전체보기</MoreLink>
      </div>

      {/* 뉴스 콘텐츠 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 메인 뉴스 (가장 최신 항목 강조) */}
        <div
          className="group cursor-pointer space-y-4 lg:col-span-2"
          role="button"
          tabIndex={0}
          onKeyDown={() => {}}
        >
          <div className="overflow-hidden rounded-xl border bg-gray-100 aspect-video relative">
            <img
              src={mainNews.imageUrl}
              alt={mainNews.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 text-primary border-0 backdrop-blur-sm shadow-sm">
                {mainNews.category}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {mainNews.date}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {mainNews.comments}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {mainNews.title}
            </h3>
            <p className="text-gray-600 line-clamp-2">{mainNews.description}</p>
          </div>
        </div>

        {/* 서브 뉴스 리스트 */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {otherNews.map((item) => (
            <div
              key={item.id}
              className="group flex gap-3 sm:gap-4 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
            >
              <div className="w-24 h-20 sm:w-32 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1 grow min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-600 border-0"
                    >
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    댓글 {item.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

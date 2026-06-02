import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, CheckCircle2 } from "lucide-react";
import { NotFound } from "@/pages/error/NotFound";
import { MOCK_CLUB_DATA } from "@/data/clubs";

/**
 * 동아리 상세 페이지 컴포넌트
 * - URL 파라미터(id)를 통해 동아리 정보를 동적으로 불러옵니다.
 * - MOCK_CLUB_DATA를 활용하여 다양한 동아리 예시를 보여줍니다.
 */
export function ClubDetail() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const clubData = id ? MOCK_CLUB_DATA[id] : null;

  if (!clubData) {
    return <NotFound />;
  }

  return (
    <div className="container flex flex-col gap-8 pb-20 mx-auto w-full">
      {/** 히어로 섹션: 동아리 대표 이미지 및 모집 상태 뱃지 */}
      <div className="relative h-[220px] sm:h-[300px] w-full rounded-2xl overflow-hidden bg-muted">
        <img
          src={`https://placehold.co/1200x400/e2e8f0/1e293b?text=${encodeURIComponent(
            clubData.title
          )}`}
          alt="Club Cover"
          className="object-cover w-full h-full"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
            {clubData.recruitment.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/** 메인 콘텐츠 영역: 동아리 상세 소개 및 활동 내역 */}
        <div className="lg:col-span-2 space-y-8">
          {/** 타이틀 및 헤더: 카테고리, 동아리명, 태그 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="font-semibold text-primary">
                {clubData.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {clubData.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {clubData.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {clubData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-secondary-foreground text-sm font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/** 동아리 소개 섹션: 상세 설명 텍스트 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">동아리 소개</h2>
            <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {clubData.longDescription.trim()}
            </div>
          </section>

          {/** 주요 활동 갤러리: 활동 사진 및 제목 리스트 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">주요 활동</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-lg overflow-hidden border bg-card"
                >
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-48 sm:h-55 object-cover object-bottom"
                  />
                  <div className="p-3">
                    <p className="font-bold text-center text-sm">
                      {activity.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/** 사이드 모집 정보: 모집 기간, 대상, 절차 등 중요 정보 */}
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-24">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">모집 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">모집 기간</p>
                    <p className="text-sm text-muted-foreground">
                      {clubData.recruitment.period}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">모집 대상</p>
                    <p className="text-sm text-muted-foreground">
                      {clubData.recruitment.target}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">선발 절차</p>
                    <p className="text-sm text-muted-foreground">
                      {clubData.recruitment.process}
                    </p>
                  </div>
                </div>

                <Separator className="my-2" />

                <Button
                  onClick={() => {
                    navigate(`/club/${id}/apply`);
                  }}
                  className="w-full font-bold text-primary-foreground py-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  지원하기
                </Button>
              </CardContent>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground">
              * 동아리 지원 관련 문의는 해당 동아리 회장에게 직접 문의 바랍니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, Trash2 } from "lucide-react";
import { getClubApplicationData } from "@/data/clubs";
import {
  getApplicationDrafts,
  removeApplicationDraft,
  type ApplicationDraftListItem,
} from "@/lib/applicationDrafts";
import { useAuth } from "@/hooks/useAuth";

function formatSavedAt(savedAt: string | undefined): string {
  if (!savedAt) return "저장 시간 없음";

  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "저장 시간 없음";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getDraftEditPath(draft: ApplicationDraftListItem): string {
  if (draft.mode === "edit") return `/applications/${draft.routeId}/edit`;
  return `/club/${draft.routeId}/apply`;
}

function getDraftClubInfo(draft: ApplicationDraftListItem) {
  const clubId = draft.clubId || (draft.mode === "create" ? draft.routeId : undefined);
  const clubData = clubId ? getClubApplicationData(clubId) : null;

  return {
    name: draft.clubName || clubData?.title || "동아리 지원서",
    category: draft.category || clubData?.category || "임시저장",
    description: clubData?.description || "작성 중인 지원서 초안입니다.",
  };
}

export function ApplicationDrafts() {
  const { studentId } = useParams<{ studentId: string }>();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<ApplicationDraftListItem[]>([]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user && studentId && String(user.studentId) !== studentId) {
      navigate(`/users/${user.studentId}/drafts`, { replace: true });
    }
  }, [studentId, user, isAuthenticated, isAuthLoading, navigate]);

  useEffect(() => {
    setDrafts(getApplicationDrafts());
  }, []);

  const handleDelete = (storageKey: string) => {
    removeApplicationDraft(storageKey);
    setDrafts((prev) => prev.filter((draft) => draft.storageKey !== storageKey));
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">임시저장함</h2>
      </div>

      {drafts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {drafts.map((draft) => {
            const clubInfo = getDraftClubInfo(draft);

            return (
              <Card key={draft.storageKey} className="shadow-sm">
                <CardContent className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200">
                        {clubInfo.category}
                      </Badge>
                      <Badge variant="secondary">
                        임시저장
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-bold text-foreground truncate">
                        {clubInfo.name}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {clubInfo.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>마지막 저장: {formatSavedAt(draft.savedAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 md:shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDelete(draft.storageKey)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </Button>
                    <Button
                      type="button"
                      onClick={() => navigate(getDraftEditPath(draft))}
                      className="cursor-pointer"
                    >
                      <FileText className="h-4 w-4" />
                      계속 작성
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-foreground">임시저장된 지원서가 없습니다.</h2>
              <p className="text-sm text-muted-foreground">
                신청서 화면에서 임시저장 버튼을 누르면 이곳에 표시됩니다.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => navigate("/clubs")} className="mt-2">
              동아리 찾기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

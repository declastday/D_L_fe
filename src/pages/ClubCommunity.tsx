import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { LoginAlertDialog } from "@/components/common/LoginAlertDialog";
import { toast } from "sonner";
import {
  Clock,
  MessageSquare,
  Search as SearchIcon,
  ThumbsUp,
} from "lucide-react";
import { isMockClubMember } from "@/lib/mockClubMembership";
import { cn } from "@/lib/utils";

type CommunityCategory =
  | "전체글"
  | "공지사항"
  | "자유게시판"
  | "질문/답변"
  | "팀모집";

type CommunityPost = {
  id: number;
  clubId: string;
  category: Exclude<CommunityCategory, "전체글">;
  title: string;
  author: string;
  createdAt: string; // yyyy.MM.dd
  views: number;
  likes: number;
  comments: number;
  depth?: number; // 답글일 경우 들여쓰기 용도(프로토타입)
};

const MOCK_POSTS: CommunityPost[] = [
  {
    id: 101,
    clubId: "6",
    category: "공지사항",
    title: " [필독] 2026학년도 1학기 운영진 안내",
    author: "관리자",
    createdAt: "2026.04.09",
    views: 128,
    likes: 45,
    comments: 12,
  },
  {
    id: 102,
    clubId: "6",
    category: "공지사항",
    title: "첫 짐 정리 일정 변경 공지",
    author: "운영진",
    createdAt: "2026.04.05",
    views: 89,
    likes: 12,
    comments: 6,
  },
  {
    id: 103,
    clubId: "6",
    category: "자유게시판",
    title: "헥사고날 스터디 모집합니다 (프로토타입)",
    author: "김철수",
    createdAt: "2026.04.08",
    views: 56,
    likes: 5,
    comments: 2,
  },
  {
    id: 104,
    clubId: "6",
    category: "자유게시판",
    title: "해커톤 준비 체크리스트 공유해요",
    author: "박지수",
    createdAt: "2026.04.04",
    views: 102,
    likes: 18,
    comments: 8,
  },
  {
    id: 105,
    clubId: "6",
    category: "질문/답변",
    title: "리뷰 세션은 어떤 방식으로 진행되나요?",
    author: "이민우",
    createdAt: "2026.04.03",
    views: 34,
    likes: 4,
    comments: 3,
  },
  {
    id: 106,
    clubId: "6",
    category: "질문/답변",
    title: "제출 자료 템플릿 있나요?",
    author: "최지원",
    createdAt: "2026.04.02",
    views: 45,
    likes: 2,
    comments: 1,
    depth: 1,
  },
  {
    id: 107,
    clubId: "6",
    category: "팀모집",
    title: "프로젝트 팀 모집: 프론트/백 나눔",
    author: "오세현",
    createdAt: "2026.04.01",
    views: 78,
    likes: 14,
    comments: 5,
  },
  {
    id: 108,
    clubId: "6",
    category: "자유게시판",
    title: "동아리 활동 기록 페이지 만들었어요",
    author: "정다은",
    createdAt: "2026.03.28",
    views: 62,
    likes: 9,
    comments: 4,
  },
];

function categoryBadgeVariant(category: CommunityPost["category"]) {
  switch (category) {
    case "공지사항":
      return { variant: "secondary" as const, className: "bg-blue-50 text-primary border-blue-200" };
    case "자유게시판":
      return { variant: "outline" as const, className: "border-primary/20 text-foreground" };
    case "질문/답변":
      return { variant: "outline" as const, className: "border-chart-3/40 text-foreground" };
    case "팀모집":
      return { variant: "outline" as const, className: "border-chart-2/40 text-foreground" };
    default:
      return { variant: "secondary" as const, className: "" };
  }
}

export function ClubCommunity() {
  const { id: clubId } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();

  const isClubMember =
    isAuthenticated && user && clubId ? isMockClubMember(user.studentId, clubId) : false;

  const [activeCategory, setActiveCategory] =
    useState<CommunityCategory>("전체글");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);

  const postsForClub = useMemo(() => {
    return MOCK_POSTS.filter((p) => p.clubId === String(clubId ?? ""));
  }, [clubId]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return postsForClub
      .filter((p) => (activeCategory === "전체글" ? true : p.category === activeCategory))
      .filter((p) => (q ? p.title.toLowerCase().includes(q) : true));
  }, [postsForClub, activeCategory, query]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedPosts = filteredPosts.slice((safePage - 1) * pageSize, safePage * pageSize);

  const countsByCategory = useMemo(() => {
    const counts: Record<Exclude<CommunityCategory, "전체글">, number> = {
      "공지사항": 0,
      "자유게시판": 0,
      "질문/답변": 0,
      "팀모집": 0,
    };
    for (const p of postsForClub) counts[p.category] += 1;
    return counts;
  }, [postsForClub]);

  const categories = useMemo(() => {
    return [
      { key: "전체글" as const, count: postsForClub.length },
      { key: "공지사항" as const, count: countsByCategory["공지사항"] },
      { key: "자유게시판" as const, count: countsByCategory["자유게시판"] },
      { key: "질문/답변" as const, count: countsByCategory["질문/답변"] },
      { key: "팀모집" as const, count: countsByCategory["팀모집"] },
    ];
  }, [postsForClub.length, countsByCategory]);

  const handleWrite = () => {
    if (!isAuthenticated) {
      setIsLoginAlertOpen(true);
      return;
    }
    if (!isClubMember) {
      toast.error("동아리 가입 후 글쓰기를 할 수 있습니다.");
      return;
    }
    toast.success("프로토타입: 글쓰기 화면은 추후 구현됩니다.");
  };

  return (
    <div className="flex min-w-0 gap-6">
      <aside className="w-64 shrink-0 hidden md:block">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <div className="bg-[#0B5CA8] px-4 py-3.5 text-center text-sm font-bold tracking-tight text-white">
            커뮤니티 메뉴
          </div>
          <nav className="bg-white px-2.5 py-3" aria-label="커뮤니티 게시판 분류">
            <ul className="flex flex-col gap-1">
              {categories.map(({ key, count }) => {
                const isActive = activeCategory === key;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(key);
                        setPage(1);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-[#E8EEF6] font-semibold text-[#1a6fc4]"
                          : "font-normal text-neutral-700 hover:bg-slate-50",
                      )}
                    >
                      <span>{key}</span>
                      <span
                        className={cn(
                          "tabular-nums flex size-7 shrink-0 items-center justify-center text-xs font-medium",
                          isActive
                            ? "rounded-full bg-[#DDE3EA] text-neutral-600"
                            : "rounded-full text-neutral-500",
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="min-w-0 space-y-1">
                  <h1 className="text-xl font-bold text-foreground">
                    {activeCategory === "전체글" ? "전체글" : activeCategory}
                  </h1>
                  <div className="text-sm text-muted-foreground">
                    동아리 ID: {clubId}
                  </div>
                </div>

                <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                  <div className="relative w-full min-w-0 sm:w-[min(100%,22rem)]">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      className="bg-background pl-9"
                      placeholder="게시글 검색"
                    />
                  </div>
                  <Button
                    onClick={handleWrite}
                    className="h-10 w-full shrink-0 sm:w-auto"
                    variant="default"
                    disabled={!isClubMember && isAuthenticated}
                  >
                    글쓰기
                  </Button>
                </div>
              </div>

              <Separator className="mb-4" />

              {pagedPosts.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  게시글이 없습니다.
                </div>
              ) : (
                <>
                  <ul className="flex flex-col gap-3 lg:hidden">
                    {pagedPosts.map((p) => {
                      const { variant, className } = categoryBadgeVariant(p.category);
                      return (
                        <li
                          key={p.id}
                          className="rounded-lg border border-border bg-card/40 px-4 py-3 transition-colors hover:bg-muted/25"
                        >
                          <div className="flex flex-wrap items-center gap-2 gap-y-2">
                            <span className="text-xs tabular-nums text-muted-foreground">
                              {p.id}
                            </span>
                            <Badge variant={variant} className={className}>
                              {p.category}
                            </Badge>
                          </div>
                          <Link
                            to="#"
                            className="mt-2 block min-w-0 break-words text-left text-sm font-medium leading-snug hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              toast.message("프로토타입: 게시글 상세 화면은 추후 구현됩니다.");
                            }}
                          >
                            {p.depth && p.depth > 0 ? (
                              <span className="mr-1 text-muted-foreground">
                                {"ㄴ".repeat(p.depth)}
                              </span>
                            ) : null}
                            {p.title}
                          </Link>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                            <span className="whitespace-nowrap">{p.author}</span>
                            <span className="whitespace-nowrap">{p.createdAt}</span>
                            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                              <Clock className="size-3.5 shrink-0" aria-hidden />
                              조회 {p.views}
                            </span>
                            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                              <MessageSquare className="size-3.5 shrink-0" aria-hidden />
                              댓글 {p.comments}
                            </span>
                            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                              <ThumbsUp className="size-3.5 shrink-0" aria-hidden />
                              추천 {p.likes}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="hidden min-w-0 lg:block">
                    <div className="overflow-x-auto rounded-md border border-border">
                      <table className="w-full min-w-[640px] table-fixed text-sm">
                        <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
                          <tr>
                            <th className="w-12 px-2 py-3 text-center font-medium">번호</th>
                            <th className="w-[7.5rem] px-2 py-3 text-left font-medium">분류</th>
                            <th className="min-w-0 px-2 py-3 text-left font-medium">제목</th>
                            <th className="w-24 px-2 py-3 text-center font-medium">작성자</th>
                            <th className="w-28 px-2 py-3 text-center font-medium">작성일</th>
                            <th className="w-16 px-1 py-3 text-center font-medium">조회</th>
                            <th className="w-16 px-1 py-3 text-center font-medium">댓글</th>
                            <th className="w-16 px-1 py-3 text-center font-medium">추천</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedPosts.map((p) => {
                            const { variant, className } = categoryBadgeVariant(p.category);
                            return (
                              <tr key={p.id} className="border-t hover:bg-muted/30">
                                <td className="px-2 py-3.5 text-center text-xs text-muted-foreground">
                                  {p.id}
                                </td>
                                <td className="px-2 py-3.5 align-top">
                                  <Badge
                                    variant={variant}
                                    className={cn(className, "max-w-full truncate align-bottom")}
                                  >
                                    {p.category}
                                  </Badge>
                                </td>
                                <td className="min-w-0 px-2 py-3.5">
                                  <Link
                                    to="#"
                                    className="flex min-w-0 items-start gap-2 hover:underline"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toast.message(
                                        "프로토타입: 게시글 상세 화면은 추후 구현됩니다.",
                                      );
                                    }}
                                  >
                                    {p.depth && p.depth > 0 ? (
                                      <span className="shrink-0 text-muted-foreground">
                                        {"ㄴ".repeat(p.depth)}
                                      </span>
                                    ) : null}
                                    <span className="min-w-0 break-words font-medium leading-snug">
                                      {p.title}
                                    </span>
                                  </Link>
                                </td>
                                <td className="px-2 py-3.5 text-center text-xs text-muted-foreground">
                                  <span className="line-clamp-2 break-words">{p.author}</span>
                                </td>
                                <td className="whitespace-nowrap px-2 py-3.5 text-center text-xs text-muted-foreground">
                                  {p.createdAt}
                                </td>
                                <td className="px-1 py-3.5 text-center text-xs text-muted-foreground">
                                  <span className="inline-flex items-center justify-center gap-1">
                                    <Clock className="size-3.5 shrink-0" aria-hidden />
                                    {p.views}
                                  </span>
                                </td>
                                <td className="px-1 py-3.5 text-center text-xs text-muted-foreground">
                                  <span className="inline-flex items-center justify-center gap-1">
                                    <MessageSquare className="size-3.5 shrink-0" aria-hidden />
                                    {p.comments}
                                  </span>
                                </td>
                                <td className="px-1 py-3.5 text-center text-xs text-muted-foreground">
                                  <span className="inline-flex items-center justify-center gap-1">
                                    <ThumbsUp className="size-3.5 shrink-0" aria-hidden />
                                    {p.likes}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-center gap-2">
              <Button
                variant="outline"
                className="h-9 px-3"
                onClick={() => setPage((v) => Math.max(1, v - 1))}
                disabled={safePage <= 1}
              >
                &lt;
              </Button>
              {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === safePage;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    className="h-9 w-9 p-0"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                className="h-9 px-3"
                onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
                disabled={safePage >= totalPages}
              >
                &gt;
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <LoginAlertDialog
        open={isLoginAlertOpen}
        onOpenChange={setIsLoginAlertOpen}
        reason="커뮤니티 글쓰기를 위해서는 로그인이 필요합니다."
      />
    </div>
  );
}


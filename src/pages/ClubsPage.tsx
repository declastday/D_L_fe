import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, LayoutGrid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MOCK_CLUB_DATA, type ClubData } from "@/data/clubs";
import {
  CLUB_CATEGORY_FILTERS,
  MOCK_CLUB_DIRECTORY_META,
  type ClubDirectoryMeta,
  type ClubDivision,
} from "@/data/clubDirectoryMeta";

type ViewMode = "card" | "list";

type ClubRow = { id: string } & ClubData & ClubDirectoryMeta;

function buildClubRows(): ClubRow[] {
  return Object.entries(MOCK_CLUB_DATA)
    .map(([id, data]) => {
      const meta = MOCK_CLUB_DIRECTORY_META[id];
      if (!meta) return null;
      return { id, ...data, ...meta };
    })
    .filter((row): row is ClubRow => row !== null)
    .sort((a, b) => Number(a.id) - Number(b.id));
}

/** 카드·리스트 썸네일: 시안처럼 어두운 네이비 톤 베이스 */
const thumbShellClass =
  "relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-slate-950";

const thumbOverlayClass =
  "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent";

/**
 * 동아리 찾기 — 분과 필터, 카드/리스트 전환, 동아리 그리드
 */
export function ClubsPage() {
  const navigate = useNavigate();
  const [division, setDivision] = useState<"all" | ClubDivision>("all");
  const [view, setView] = useState<ViewMode>("card");

  const allRows = useMemo(() => buildClubRows(), []);

  const filtered = useMemo(() => {
    if (division === "all") return allRows;
    return allRows.filter((row) => row.division === division);
  }, [allRows, division]);

  const activeFilterLabel =
    CLUB_CATEGORY_FILTERS.find((f) => f.key === division)?.label ?? "전체";

  const sectionTitle =
    division === "all" ? "전체 동아리" : `${activeFilterLabel} 동아리`;

  return (
    <div className="mx-auto w-full max-w-7xl pb-16 sm:pb-20">
      <div className="flex flex-col gap-6 rounded-2xl bg-muted/45 px-3 py-6 sm:gap-8 sm:px-6 sm:py-8">
        {/* 분과 필터 바 */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CLUB_CATEGORY_FILTERS.map(
            ({ key, label, icon: Icon, inactiveIconClass }) => {
              const isActive = division === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDivision(key)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground shadow-xs hover:bg-muted/60",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive
                        ? "text-primary-foreground"
                        : inactiveIconClass,
                    )}
                    aria-hidden
                  />
                  {label}
                </button>
              );
            },
          )}
        </div>

        {/* 섹션 헤더 + 뷰 전환 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {sectionTitle}
            </span>
            <span className="text-base font-semibold tabular-nums text-primary sm:text-lg">
              {filtered.length}
            </span>
          </h1>

          <div
            className="inline-flex self-start rounded-xl bg-muted/80 p-1 sm:self-auto"
            role="group"
            aria-label="보기 방식"
          >
            <button
              type="button"
              onClick={() => setView("card")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                view === "card"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
              카드형
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                view === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="h-4 w-4" aria-hidden />
              리스트형
            </button>
          </div>
        </div>

        {view === "card" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {filtered.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onOpen={() => navigate(`/club/${club.id}`)}
              />
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((club) => (
              <li key={club.id}>
                <ClubListRow
                  club={club}
                  onOpen={() => navigate(`/club/${club.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ClubThumb({
  club,
  aspectClass,
}: {
  club: ClubRow;
  aspectClass: string;
}) {
  return (
    <div className={cn(thumbShellClass, aspectClass)}>
      {club.coverImage ? (
        <>
          <img
            src={club.coverImage}
            alt=""
            className="h-full w-full object-cover opacity-[0.88]"
            loading="lazy"
          />
          <div className={thumbOverlayClass} aria-hidden />
        </>
      ) : (
        <>
          <div className={thumbOverlayClass} aria-hidden />
          <div className="relative z-[1] flex h-full w-full items-center justify-center text-xs font-medium text-white/45">
            CLUB
          </div>
        </>
      )}
      <div className="absolute left-3 top-3 z-[2] flex flex-wrap items-start gap-2">
        <Badge className="border-0 bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
          {club.division}
        </Badge>
      </div>
      {club.deadlineToday && (
        <div className="absolute right-3 top-3 z-[2]">
          <Badge className="border-0 bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
            오늘까지
          </Badge>
        </div>
      )}
    </div>
  );
}

function ClubCard({
  club,
  onOpen,
}: {
  club: ClubRow;
  onOpen: () => void;
}) {
  const tagLine = club.tags.slice(0, 3).join(" ");

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card py-0 shadow-sm transition-shadow",
        "hover:border-primary/35 hover:shadow-md",
      )}
    >
      <ClubThumb club={club} aspectClass="aspect-[5/3] w-full" />
      <div className="space-y-2 bg-card p-4">
        <h2 className="text-lg font-bold leading-snug text-foreground">
          {club.title}
        </h2>
        <p className="line-clamp-1 text-sm text-muted-foreground">{tagLine}</p>
        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            <span className="tabular-nums">{club.memberCount}명</span>
          </span>
          <span className="shrink-0 font-semibold text-primary">
            {club.recruitmentLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}

function ClubListRow({
  club,
  onOpen,
}: {
  club: ClubRow;
  onOpen: () => void;
}) {
  const tagLine = club.tags.slice(0, 3).join(" ");

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-border/70 p-4 shadow-sm transition-shadow sm:flex-row sm:items-stretch",
        "hover:border-primary/35 hover:shadow-md",
      )}
    >
      <ClubThumb
        club={club}
        aspectClass="h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-48 sm:shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">{club.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tagLine}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4 opacity-80" aria-hidden />
            {club.memberCount}명
          </span>
          <span className="font-semibold text-primary">
            {club.recruitmentLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}

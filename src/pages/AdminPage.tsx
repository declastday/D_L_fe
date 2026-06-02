import { useState } from "react";
import {
  PlusCircle,
  Settings,
  FileText,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  Trash2,
  Save,
  CirclePlus,
  Search,
  SlidersHorizontal,
  Bold,
  Italic,
  Underline,
  ImagePlus,
  Plus,
  X,
  SquarePen,
  Pencil,
  ChevronDown,
} from "lucide-react";
import { CLUB_DIVISION_KEYS } from "@/data/clubDirectoryMeta";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AdminTab =
  | "club-register"
  | "application-form"
  | "submitted-applications"
  | "page-tags"
  | "community-board";

const ADMIN_MENU: {
  section: string;
  items: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    tab: AdminTab;
  }[];
}[] = [
  {
    section: "동아리 관리",
    items: [
      { label: "동아리 정보", icon: PlusCircle, tab: "club-register" },
      { label: "상세페이지 설정", icon: Tag, tab: "page-tags" },
    ],
  },
  {
    section: "신청서 관리",
    items: [
      { label: "신청폼 설정", icon: Settings, tab: "application-form" },
      {
        label: "신청서 관리",
        icon: FileText,
        tab: "submitted-applications",
      },
    ],
  },
  {
    section: "커뮤니티",
    items: [
      {
        label: "게시판 관리",
        icon: MessageSquare,
        tab: "community-board",
      },
    ],
  },
];

const APPLICATION_QUESTIONS = [
  { id: 1, title: "지원 동기를 작성해주세요.", type: "단답형" },
  { id: 2, title: "본인의 장단점을 설명해주세요.", type: "장문형" },
  {
    id: 3,
    title: "해당 분야에 대한 경험이 있으신가요?",
    type: "객관식 (단일선택)",
  },
] as const;

const SUBMITTED_APPLICATIONS = [
  {
    id: 1,
    name: "김철수",
    studentId: "20230001",
    major: "컴퓨터공학부",
    submittedAt: "2026.04.01",
    status: "검토중",
  },
  {
    id: 2,
    name: "이영희",
    studentId: "20230015",
    major: "경영학과",
    submittedAt: "2026.04.01",
    status: "합격",
  },
  {
    id: 3,
    name: "박지민",
    studentId: "20240102",
    major: "시각디자인과",
    submittedAt: "2026.03.31",
    status: "불합격",
  },
  {
    id: 4,
    name: "최동현",
    studentId: "20220304",
    major: "전자전기공학부",
    submittedAt: "2026.03.30",
    status: "검토중",
  },
] as const;

const PAGE_TAGS = ["#프로젝트", "#해커톤", "#네트워킹", "#개발스터디"] as const;

const COMMUNITY_POSTS = [
  {
    id: 1,
    isNotice: true,
    title: "[공지] 2026학년도 1학기 신입 부원 모집 안내",
    author: "운영진",
    createdAt: "2026.04.01",
    views: 342,
  },
  {
    id: 2,
    isNotice: true,
    title: "첫 정기 세션 일정 변경의 건",
    author: "운영진",
    createdAt: "2026.03.28",
    views: 156,
  },
  {
    id: 3,
    isNotice: false,
    title: "해커톤 팀원 모집합니다~ (프론트엔드 우대)",
    author: "김철수",
    createdAt: "2026.03.25",
    views: 89,
  },
  {
    id: 4,
    isNotice: false,
    title: "지난 스터디 자료 공유",
    author: "이영희",
    createdAt: "2026.03.20",
    views: 45,
  },
] as const;

const CLUB_DETAIL_DESCRIPTION_PLACEHOLDER =
  "예: 코딩 스터디, 프로젝트, 세미나 등을 통해 함께 성장하는 학술 동아리입니다.";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("application-form");
  const [clubCategory, setClubCategory] = useState("");
  const [clubDetailDescription, setClubDetailDescription] = useState("");

  const renderMainContent = () => {
    if (activeTab === "club-register") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-2xl align-bottom font-bold text-foreground">
            동아리 정보
          </h2>
          <div className="mt-0 border-t border-slate-200 pt-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  동아리명 <span className="text-red-500">*</span>
                </h3>
                <Input placeholder="예: CPR" className="mt-3 h-10 bg-white" />
              </div>
              <div>
                <h3 id="club-category-label" className="text-base font-bold text-slate-800">
                  카테고리 <span className="text-red-500">*</span>
                </h3>
                <div className="relative mt-3">
                  <select
                    id="club-category"
                    aria-labelledby="club-category-label"
                    value={clubCategory}
                    onChange={(e) => setClubCategory(e.target.value)}
                    className={cn(
                      "h-10 w-full appearance-none rounded-md border border-input bg-white px-3 pr-10 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      !clubCategory && "text-muted-foreground",
                    )}
                  >
                    <option value="" disabled>
                      분과를 선택해주세요
                    </option>
                    {CLUB_DIVISION_KEYS.map((division) => (
                      <option key={division} value={division} className="text-foreground">
                        {division}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-base font-bold text-slate-800">
                대표 이미지{" "}
                <span className="text-sm font-medium text-slate-400">(권장: 1920×1080px)</span>
              </h3>
              <button
                type="button"
                className="mt-3 flex h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <ImageIcon className="mb-2 size-8 text-slate-400" />
                <span className="text-sm font-medium">
                  클릭하여 이미지 업로드
                </span>
              </button>
            </div>

            <div className="mt-5">
              <h3 className="text-base font-bold text-slate-800">
                모집 대상 및 자격 요건 <span className="text-red-500">*</span>
              </h3>
              <Textarea
                placeholder="지원 가능한 대상과 자격 요건을 입력해주세요."
                className="mt-3 min-h-[84px] resize-none bg-white"
              />
            </div>

            <section className="mt-5">
              <h3 className="text-base font-bold text-slate-800">
                태그 설정 <span className="text-sm font-medium text-slate-400">(최대 5개)</span>
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {PAGE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FC] px-3 py-1.5 text-sm font-semibold text-[#1B4A8F]"
                  >
                    {tag}
                    <button
                      type="button"
                      className="inline-flex size-4 items-center justify-center rounded-full bg-[#D9E6FB] text-[#1B4A8F]"
                      aria-label={`${tag} 삭제`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <Plus className="size-3.5" />
                  태그 추가
                </button>
              </div>
            </section>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 w-full rounded-lg px-5 sm:w-auto">
                <Save className="mr-1 size-4" />
                저장
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "application-form") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl align-bottom font-bold text-foreground">
              신청폼 설정
            </h2>
            <Button className="h-9 w-full rounded-lg bg-slate-900 px-4 text-white hover:bg-slate-800 sm:w-auto">
              <CirclePlus className="mr-1 size-4" />새 문항 추가
            </Button>
          </div>

          <div className="mt-0 border-t border-slate-200 pt-5">
            <ul className="space-y-4">
              {APPLICATION_QUESTIONS.map((question) => (
                <li
                  key={question.id}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                          {question.id}
                        </span>
                        <p className="text-sm font-semibold text-foreground">
                          {question.title}
                        </p>
                      </div>
                      <span className="mt-2 ml-10 inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                        {question.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 pt-1 sm:justify-end">
                      <label className="inline-flex cursor-pointer items-center gap-2 align-bottom text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-300"
                        />
                        필수 응답
                      </label>
                      <button
                        type="button"
                        className="text-slate-400 transition-colors hover:text-slate-600"
                        aria-label="문항 삭제"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 w-full rounded-lg px-5 sm:w-auto">
                <Save className="mr-1 size-4" />
                변경사항 저장
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "submitted-applications") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl align-bottom font-bold text-foreground">
                신청서 관리
              </h2>
              <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-lg font-extrabold text-[#1F4F95]">
                총 12명
              </span>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
              <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-500 sm:flex-1 xl:w-[280px] xl:flex-none">
                <Search className="size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="이름, 학번, 학과 검색"
                  className="h-full w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 sm:w-11"
                aria-label="필터"
              >
                <SlidersHorizontal className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full table-fixed">
              <thead className="bg-[#F8FAFD]">
                <tr className="h-12 text-left text-sm font-semibold text-slate-500">
                  <th className="w-[72px] px-4">NO.</th>
                  <th className="w-[160px] px-4">이름 / 학번</th>
                  <th className="w-[160px] px-4">학과</th>
                  <th className="w-[130px] px-4">지원일시</th>
                  <th className="w-[120px] px-4">상태</th>
                  <th className="w-[130px] px-4 text-center">상세보기</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {SUBMITTED_APPLICATIONS.map((applicant) => {
                  const statusClassName =
                    applicant.status === "합격"
                      ? "bg-[#E8FAEE] text-[#14863F]"
                      : applicant.status === "불합격"
                        ? "bg-[#FDECEE] text-[#D7263D]"
                        : "bg-[#FFF9E8] text-[#B48319]";

                  return (
                    <tr
                      key={applicant.id}
                      className="h-[88px] border-t border-slate-100 text-sm text-slate-700 first:border-t-0"
                    >
                      <td className="px-4 text-sm font-semibold text-slate-600">
                        {applicant.id}
                      </td>
                      <td className="px-4">
                        <div className="text-sm font-bold leading-tight text-slate-900">
                          {applicant.name}
                        </div>
                        <div className="mt-1 text-sm font-medium text-slate-500">
                          {applicant.studentId}
                        </div>
                      </td>
                      <td className="px-4 text-sm font-semibold text-slate-700">
                        {applicant.major}
                      </td>
                      <td className="px-4 text-sm font-semibold text-slate-500">
                        {applicant.submittedAt}
                      </td>
                      <td className="px-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                            statusClassName,
                          )}
                        >
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-4 text-center">
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#EDF3FF] px-4 text-sm font-semibold text-[#2B63B4] transition-colors hover:bg-[#E2EDFF]"
                        >
                          지원서 보기
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-500">전체 12명 중 1-4명</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-400"
                >
                  이전
                </button>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-bold text-[#2B63B4]"
                >
                  1
                </button>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-500"
                >
                  2
                </button>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-500"
                >
                  3
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "page-tags") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-2xl align-bottom font-bold text-foreground">
            상세페이지 설정
          </h2>

          <div className="mt-0 border-t border-slate-200 pt-6">
            <section>
              <h3 className="text-base font-bold text-slate-800">
                동아리 상세 설명
              </h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                <div className="flex h-11 items-center gap-1 border-b border-slate-200 bg-[#F8FAFD] px-3">
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="굵게"
                  >
                    <Bold className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="기울임"
                  >
                    <Italic className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="밑줄"
                  >
                    <Underline className="size-4" />
                  </button>
                  <div className="mx-1 h-4 w-px bg-slate-300" />
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="이미지 삽입"
                  >
                    <ImagePlus className="size-4" />
                  </button>
                </div>
                <Textarea
                  id="club-detail-description"
                  value={clubDetailDescription}
                  onChange={(e) => setClubDetailDescription(e.target.value)}
                  placeholder={CLUB_DETAIL_DESCRIPTION_PLACEHOLDER}
                  className="min-h-[170px] w-full resize-y rounded-none border-0 bg-white p-4 text-sm leading-relaxed shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="동아리 상세 설명"
                />
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-base font-bold text-slate-800">활동 사진 추가</h3>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {[1, 2, 3].map((photoNo) => (
                  <div
                    key={photoNo}
                    className="flex h-[96px] w-[96px] items-center justify-center rounded-xl border border-slate-200 bg-[#F4F6FA] text-sm font-semibold text-slate-400 sm:h-[116px] sm:w-[116px] sm:text-base"
                  >
                    사진 {photoNo}
                  </div>
                ))}
                <button
                  type="button"
                  className="flex h-[96px] w-[96px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-500 transition-colors hover:bg-slate-50 sm:h-[116px] sm:w-[116px]"
                >
                  <div className="inline-flex size-8 items-center justify-center rounded-full border border-slate-300">
                    <Plus className="size-4" />
                  </div>
                  <span className="mt-2 text-sm font-semibold">사진 추가</span>
                </button>
              </div>
            </section>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 w-full rounded-lg bg-[#0A5CB5] px-6 text-white hover:bg-[#0A4F9D] sm:w-auto">
                <Save className="mr-1.5 size-4" />
                페이지 설정 저장
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "community-board") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl align-bottom font-bold text-foreground">
              게시판 관리
            </h2>
            <Button className="h-11 w-full rounded-xl bg-[#0F1B33] px-5 text-sm font-semibold text-white hover:bg-[#111f3b] sm:w-auto">
              <SquarePen className="mr-2 size-4" />
              게시글 작성
            </Button>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full table-fixed">
              <thead className="bg-[#F8FAFD]">
                <tr className="h-12 border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
                  <th className="w-[72px] px-4">선택</th>
                  <th className="px-4">제목</th>
                  <th className="w-[96px] px-4">작성자</th>
                  <th className="w-[108px] px-4">작성일</th>
                  <th className="w-[72px] px-4">조회</th>
                  <th className="w-[88px] px-4 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {COMMUNITY_POSTS.map((post) => (
                  <tr
                    key={post.id}
                    className="h-[56px] border-t border-slate-100 text-sm font-medium text-slate-700 first:border-t-0"
                  >
                    <td className="px-4">
                      <input
                        type="checkbox"
                        className="size-5 rounded border-slate-300 align-middle"
                        aria-label={`${post.title} 선택`}
                      />
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        {post.isNotice ? (
                          <Badge className="px-2 py-0.5 text-[11px] font-semibold">공지</Badge>
                        ) : null}
                        <span className="truncate text-[15px] font-semibold text-slate-800">
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 text-sm text-slate-600">{post.author}</td>
                    <td className="px-4 text-sm text-slate-500">{post.createdAt}</td>
                    <td className="px-4 text-sm text-slate-500">{post.views}</td>
                    <td className="px-4">
                      <div className="flex items-center justify-center gap-3 text-slate-400">
                        <button
                          type="button"
                          className="transition-colors hover:text-slate-600"
                          aria-label={`${post.title} 수정`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="transition-colors hover:text-slate-600"
                          aria-label={`${post.title} 삭제`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-3">
              <button
                type="button"
                className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                선택 삭제
              </button>
              <button
                type="button"
                className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                공지로 등록
              </button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-2xl align-bottom font-bold text-foreground">준비 중인 메뉴</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          현재 탭은 다음 화면에서 구현 예정입니다.
        </p>
      </Card>
    );
  };

  return (
    <section className="w-full rounded-xl border border-border bg-[#F6F8FB]">
      <div className="flex min-h-[760px] flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-border bg-[#F3F5F8] lg:w-[248px] lg:border-r lg:border-b-0">
          <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="text-2xl font-extrabold tracking-tight text-[#1B4A8F]">
              Dream Lounge
            </div>
            <div className="mt-1 text-xs font-semibold tracking-[0.2em] text-slate-400">
              ADMINISTRATOR
            </div>
          </div>

          <nav className="space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-5" aria-label="관리자 메뉴">
            {ADMIN_MENU.map((group) => (
              <div key={group.section}>
                <p className="mb-2 px-2 text-xs font-semibold text-slate-400">
                  {group.section}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          onClick={() => setActiveTab(item.tab)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                            isActive
                              ? "border-r-2 border-primary bg-[#EAF1FC] text-primary"
                              : "text-slate-600 hover:bg-slate-100",
                          )}
                        >
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 bg-[#F6F8FB]">
          <div className="p-3 sm:p-5 lg:p-8">{renderMainContent()}</div>
        </div>
      </div>
    </section>
  );
}

import { useState, useRef, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


/**
 * 히어로 캐러셀 슬라이드 데이터 인터페이스
 */
interface HeroSlide {
    id: number;
    title: string;
    description: string;
    tags: string[];
    gradient: string;
}

/**
 * 히어로 캐러셀 슬라이드 임시 데이터
 */
const SLIDES: HeroSlide[] = [
    {
        id: 1,
        title: "2025년 최고의 동아리를 만나보세요",
        description: "다양한 분야에서 활발히 활동하는 동아리들의 이야기를 들어보세요",
        tags: ["공지"],
        gradient: "linear-gradient(162.608deg, rgb(21, 93, 252) 0%, rgb(79, 57, 246) 50%, rgb(152, 16, 250) 100%)",
    },
    {
        id: 2,
        title: "2026년 신입 동아리원 모집이 시작되었습니다",
        description: "새로운 도전과 성장의 기회, 지금 바로 지원하세요",
        tags: ["공지"],
        gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)",
    },
    {
        id: 3,
        title: "동아리 박람회가 개최됩니다",
        description: "각 동아리의 특색있는 활동을 직접 체험해보세요",
        tags: ["이벤트"],
        gradient: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
    },
    {
        id: 4,
        title: "우수 동아리 활동 사례를 소개합니다",
        description: "창의적이고 의미있는 동아리 활동들을 만나보세요",
        tags: ["활동"],
        gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)",
    },
];

/**
 * 히어로 캐러셀 컴포넌트
 * - 메인 페이지 상단에 위치하여 주요 프로모션이나 인기 동아리 정보를 슬라이드 형태로 제공합니다.
 * - 자동 재생 기능과 페이지네이션 도트를 포함합니다.
 */
export function HeroCarousel() {
    const [api, setApi] = useState<CarouselApi>();
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    );

    return (
        <section className="w-full h-full rounded-2xl overflow-hidden shadow-lg relative group">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent className="h-full ml-0">
                    {SLIDES.map((slide) => (
                        <CarouselItem key={slide.id} className="pl-0 h-full relative">
                            {/** 배경 레이어: 슬라이드별 고유 그라디언트 적용 */}
                            <div
                                className="absolute inset-0 w-full h-full"
                                style={{ background: slide.gradient }}
                            />
                            {/** 가독성 오버레이: 텍스트 시인성을 위한 어두운 그라디언트 처리 */}
                            <div className="absolute inset-0 w-full h-full bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                            {/** 컨텐츠 섹션: 태그, 제목, 설명 문구 표시 */}
                            <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8 py-16 sm:py-24 text-white gap-3 sm:gap-4">
                                <div className="flex gap-2">
                                    {slide.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-background/30 text-white border-0 backdrop-blur-sm">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold whitespace-pre-line leading-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-white/80 text-base sm:text-lg">
                                    {slide.description}
                                </p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/** 페이지네이션: 현재 슬라이드 위치 표시 (우측 하단) */}
            <CarouselDots api={api} count={SLIDES.length} />
        </section>
    );
}

/**
 * 캐러셀 페이지네이션 도트 컴포넌트
 * - 현재 활성화된 슬라이드를 시각적으로 표시합니다.
 */
function CarouselDots({ api, count }: { api: CarouselApi | undefined, count: number }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;
        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };
        api.on("select", onSelect);
        onSelect();
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    return (
        <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex gap-1.5">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        current === index ? "w-8 bg-white" : "w-2 bg-white/50"
                    )}
                />
            ))}
        </div>
    )
}

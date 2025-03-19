import { FC, useMemo, useCallback, useState } from "react";
import Slider from "react-slick";
import { RecommendationItem } from "@/types/product";
import { RecommendationCard } from "./RecommendationCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RecommendationsListProps {
  recommendations: Record<string, RecommendationItem[]>;
}

export const RecommendationsList: FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1536,
          settings: {
            slidesToShow: 3,
            infinite: true,
          },
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 2,
            infinite: true,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            infinite: true,
          },
        },
      ],
    }),
    []
  );

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      {Object.entries(recommendations).map(([category, items]) => (
        <div key={category} className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-heading">
            {category}
          </h2>
          <div className="mx-2 sm:mx-5 md:mx-10 relative">
            <Slider {...sliderSettings}>
              {items.map((item: RecommendationItem) => (
                <div key={item.id} className="p-2 sm:p-4 h-full">
                  <RecommendationCard
                    item={item}
                    isLoaded={loadedImages.has(item.image)}
                    onLoad={() => handleImageLoad(item.image)}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      ))}
      <style jsx global>{`
        .slick-prev,
        .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
          transition: all 0.3s ease;
        }
        .slick-prev {
          left: -40px;
        }
        .slick-next {
          right: -40px;
        }
        .slick-prev:before,
        .slick-next:before {
          font-size: 40px;
          color: #3878ff;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        .slick-prev:hover:before,
        .slick-next:hover:before {
          opacity: 1;
        }
        .slick-dots {
          bottom: -30px;
        }
        .slick-dots li button:before {
          font-size: 12px;
          color: #3878ff;
          opacity: 0.4;
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
        }
        .slick-slide {
          height: inherit !important;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .slick-slide > div {
          height: 100%;
        }
        @media (max-width: 768px) {
          .slick-prev {
            left: -25px;
          }
          .slick-next {
            right: -25px;
          }
          .slick-prev:before,
          .slick-next:before {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};

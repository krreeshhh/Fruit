import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * DESIGN PHILOSOPHY: Premium Character Showcase
 * - Bold typography hierarchy with Anton display font
 * - Smooth 650ms transitions with cubic-bezier easing
 * - Layered depth: grain overlay, ghost text, carousel, UI elements
 * - Responsive scaling from mobile to desktop
 * - Smooth color transitions matching character themes
 */

const IMAGES = [
  {
    src: "/1x2.png",
    bg: "#BA591E",
    panel: "#F79B7F",
  },
  {
    src: "/1x2.png",
    bg: "#6BBF7A",
    panel: "#85CC92",
  },
  {
    src: "/1x2.png",
    bg: "#E882B4",
    panel: "#ED9DC4",
  },
  {
    src: "/1x2.png",
    bg: "#6EB5FF",
    panel: "#8DC4FF",
  },
];

export default function ToonhubCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const swipeState = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
  });

  // Preload all images on mount
  useEffect(() => {
    IMAGES.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) =>
      direction === "next" ? (prev + 1) % 4 : (prev + 3) % 4
    );
    setTimeout(() => setIsAnimating(false), 650);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    swipeState.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeState.current.active || swipeState.current.pointerId !== e.pointerId) {
      return;
    }

    const deltaX = e.clientX - swipeState.current.startX;
    const deltaY = e.clientY - swipeState.current.startY;

    if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  };

  const finishSwipe = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeState.current.active || swipeState.current.pointerId !== e.pointerId) {
      return;
    }

    const deltaX = e.clientX - swipeState.current.startX;
    const deltaY = e.clientY - swipeState.current.startY;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      navigate(deltaX < 0 ? "next" : "prev");
    }

    swipeState.current.active = false;
    swipeState.current.pointerId = -1;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Derive roles from activeIndex
  const center = activeIndex;
  const left = (activeIndex + 3) % 4;
  const right = (activeIndex + 1) % 4;
  const back = (activeIndex + 2) % 4;

  const getRoleForIndex = (
    idx: number
  ): "center" | "left" | "right" | "back" => {
    if (idx === center) return "center";
    if (idx === left) return "left";
    if (idx === right) return "right";
    return "back";
  };

  const getStylesForRole = (
    role: "center" | "left" | "right" | "back"
  ): React.CSSProperties => {
    const baseTransition =
      "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)";
    const baseWillChange = "transform, filter, opacity";

    if (role === "center") {
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.08 : 1.68})`,
        filter: "blur(0px)",
        opacity: 1,
        zIndex: 20,
        left: "50%",
        height: isMobile ? "65%" : "82%",
        bottom: isMobile ? "30%" : "20%",
        transition: baseTransition,
        willChange: baseWillChange,
      };
    } else if (role === "left") {
      return {
        transform: "translateX(-50%) scale(1)",
        filter: "blur(2px)",
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? "18%" : "30%",
        height: isMobile ? "12%" : "28%",
        bottom: isMobile ? "34%" : "14%",
        transition: baseTransition,
        willChange: baseWillChange,
      };
    } else if (role === "right") {
      return {
        transform: "translateX(-50%) scale(1)",
        filter: "blur(2px)",
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? "82%" : "70%",
        height: isMobile ? "12%" : "28%",
        bottom: isMobile ? "34%" : "14%",
        transition: baseTransition,
        willChange: baseWillChange,
      };
    } else {
      // back
      return {
        transform: "translateX(-50%) scale(1)",
        filter: "blur(4px)",
        opacity: 1,
        zIndex: 5,
        left: "50%",
        height: isMobile ? "10%" : "22%",
        bottom: isMobile ? "34%" : "14%",
        transition: baseTransition,
        willChange: baseWillChange,
      };
    }
  };

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          touchAction: "pan-y",
          userSelect: "none",
          cursor: "grab",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishSwipe}
        onPointerCancel={finishSwipe}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise' /%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Giant ghost text for the hero product */}
        <div
          style={{
            position: "absolute",
            insetInline: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
            top: isMobile ? "10%" : "18%",
          }}
        >
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile ? "clamp(42px, 16vw, 72px)" : "clamp(78px, 24vw, 320px)",
              fontWeight: 900,
              color: "white",
              opacity: 1,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: isMobile ? "-0.03em" : "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            FRUIT POWDER
          </div>
        </div>

        {/* Top-left brand label */}
        <div
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "1rem",
            zIndex: 60,
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "white",
            opacity: 0.9,
            letterSpacing: "0.18em",
          }}
          className="sm:left-8"
        >
          
        </div>

        {/* Carousel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
          }}
        >
          {IMAGES.map((image, idx) => {
            const role = getRoleForIndex(idx);
            const styles = getStylesForRole(role);
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  aspectRatio: "0.6 / 1",
                  ...styles,
                }}
              >
                <img
                  src={image.src}
                  alt={`Mango powder package ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "bottom center",
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "1rem",
            zIndex: 60,
            maxWidth: "320px",
          }}
          className="sm:bottom-20 sm:left-24"
        >
          <p
            style={{
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              color: "white",
              opacity: 0.95,
              letterSpacing: "0.02em",
            }}
            className="sm:mb-3 sm:text-[22px]"
          >
            Fruit POWDER
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "white",
              opacity: 0.85,
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
            className="sm:text-sm sm:mb-5"
          >
            Freeze-dried mango powder with a bold tropical flavor and smooth
            mixability. Perfect for drinks, desserts, and creative recipes.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            {/* Left arrow button */}
            <button
              onClick={() => navigate("prev")}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "transparent",
                border: "2px solid white",
                borderRadius: "50%",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 150ms, background-color 150ms",
              }}
              className="sm:w-16 sm:h-16 hover:scale-108 hover:bg-white/12"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.08)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(255, 255, 255, 0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>

            {/* Right arrow button */}
            <button
              onClick={() => navigate("next")}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "transparent",
                border: "2px solid white",
                borderRadius: "50%",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 150ms, background-color 150ms",
              }}
              className="sm:w-16 sm:h-16 hover:scale-108 hover:bg-white/12"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.08)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(255, 255, 255, 0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right link "DISCOVER IT" */}
        <a
          href="#"
          style={{
            position: "absolute",
            bottom: "1.5rem",
            right: "1rem",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(20px, 4vw, 56px)",
            fontWeight: 400,
            color: "white",
            opacity: 0.95,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "opacity 200ms",
          }}
          className="sm:bottom-20 sm:right-10 hover:opacity-100"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "0.95";
          }}
        >
          DISCOVER
          <ArrowRight
            size={20}
            strokeWidth={2.25}
            style={{
              width: "1.25rem",
              height: "1.25rem",
            }}
            className="sm:w-8 sm:h-8"
          />
        </a>
      </div>
    </div>
  );
}

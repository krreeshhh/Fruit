import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

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
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    bg: "#F4845F",
    panel: "#F79B7F",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png",
    bg: "#6BBF7A",
    panel: "#85CC92",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png",
    bg: "#E882B4",
    panel: "#ED9DC4",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png",
    bg: "#6EB5FF",
    panel: "#8DC4FF",
  },
];

export default function ToonhubCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

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
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: "blur(0px)",
        opacity: 1,
        zIndex: 20,
        left: "50%",
        height: isMobile ? "60%" : "92%",
        bottom: isMobile ? "22%" : 0,
        transition: baseTransition,
        willChange: baseWillChange,
      };
    } else if (role === "left") {
      return {
        transform: "translateX(-50%) scale(1)",
        filter: "blur(2px)",
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? "20%" : "30%",
        height: isMobile ? "16%" : "28%",
        bottom: isMobile ? "32%" : "12%",
        transition: baseTransition,
        willChange: baseWillChange,
      };
    } else if (role === "right") {
      return {
        transform: "translateX(-50%) scale(1)",
        filter: "blur(2px)",
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? "80%" : "70%",
        height: isMobile ? "16%" : "28%",
        bottom: isMobile ? "32%" : "12%",
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
        height: isMobile ? "13%" : "22%",
        bottom: isMobile ? "32%" : "12%",
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
        }}
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

        {/* Giant ghost text "3D SHAPE" */}
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
            top: "18%",
          }}
        >
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(90px, 28vw, 380px)",
              fontWeight: 900,
              color: "white",
              opacity: 1,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            3D SHAPE
          </div>
        </div>

        {/* Top-left brand label "TOONHUB" */}
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
          TOONHUB
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
                  alt={`Character ${idx + 1}`}
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
            TOONHUB FIGURINES
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "white",
              opacity: 0.85,
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
            className="hidden sm:block sm:text-sm sm:mb-5"
          >
            The artwork is stunning, shipped fully prepared. The finish is a
            vision, the 3D craft is flawless. Many thanks! Wishing you the win.
            Order now.
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
          DISCOVER IT
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

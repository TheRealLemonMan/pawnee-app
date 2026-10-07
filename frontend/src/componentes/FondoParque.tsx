import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CURVAS = [
  "M-120 140 C 180 40, 420 230, 680 130 S 1120 20, 1580 150",
  "M-120 210 C 200 110, 440 300, 700 200 S 1140 90, 1580 220",
  "M-120 290 C 220 170, 470 380, 730 270 S 1160 160, 1580 300",
  "M-120 380 C 230 250, 490 470, 750 350 S 1180 240, 1580 390",
  "M-120 480 C 250 340, 520 570, 780 440 S 1200 330, 1580 490",
  "M-120 590 C 260 440, 540 680, 810 540 S 1220 430, 1580 600",
  "M-120 710 C 280 550, 560 800, 840 650 S 1240 540, 1580 720",
  "M-120 830 C 300 670, 580 920, 870 770 S 1260 660, 1580 840",
];

export function FondoParque() {
  const fondoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to(".curvas-a", {
        x: 34,
        y: -18,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".curvas-b", {
        x: -26,
        y: 14,
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".bruma", {
        x: 28,
        duration: 26,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".flora", {
        y: 12,
        rotation: 2,
        duration: 7.5,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.8 },
        ease: "sine.inOut",
        transformOrigin: "50% 80%",
      });
    },
    { scope: fondoRef }
  );

  return (
    <div className="fondo-parque" ref={fondoRef} aria-hidden="true">
      <svg className="fondo-mapa" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <filter id="grano" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1440" height="900" filter="url(#grano)" opacity="0.16" />

        <g className="bruma">
          <ellipse cx="160" cy="80" rx="380" ry="220" fill="#1f5c42" opacity="0.09" />
          <ellipse cx="1280" cy="140" rx="340" ry="200" fill="#c6a15a" opacity="0.14" />
          <ellipse cx="820" cy="860" rx="460" ry="220" fill="#12352c" opacity="0.07" />
        </g>

        <g className="curvas-a" fill="none" stroke="#12352c" strokeWidth="1.15" opacity="0.16">
          {CURVAS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g className="curvas-b" fill="none" stroke="#1f5c42" strokeWidth="1.15" opacity="0.2">
          <ellipse cx="1160" cy="250" rx="64" ry="38" />
          <ellipse cx="1160" cy="250" rx="118" ry="70" />
          <ellipse cx="1160" cy="250" rx="178" ry="106" />
          <ellipse cx="1160" cy="250" rx="248" ry="146" />
          <ellipse cx="210" cy="690" rx="52" ry="34" />
          <ellipse cx="210" cy="690" rx="100" ry="62" />
          <ellipse cx="210" cy="690" rx="156" ry="94" />
        </g>

        <g fill="#12352c" opacity="0.16" transform="translate(48,520) rotate(-8)">
          <g className="flora">
          <path
            d="M50 200c2-48 8-96 20-146"
            fill="none"
            stroke="#12352c"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M58 186c-24-8-40-2-52 12 18 2 34-2 52-12zm8-30c-26-6-42 2-56 16 20 0 38-4 56-16zm8-30c-24-10-42-2-56 12 18 2 38-2 56-12zm8-32c-20-12-40-6-52 8 16 4 36 0 52-8zm6-30c-16-14-36-10-48 4 14 6 32 4 48-4z" />
          <path d="M70 174c22-12 38-4 50 12-18 4-34 0-50-12zm6-32c24-10 40 0 50 16-20 2-36-2-50-16zm6-32c22-12 38-4 48 10-18 4-34 0-48-10zm6-30c16-14 34-8 44 6-14 6-30 2-44-6z" />
          </g>
        </g>

        <g fill="#1f5c42" opacity="0.15" transform="translate(1188,36) rotate(14)">
          <g className="flora">
          <path d="M52 6c8 24 6 44-2 64 10-8 22-10 36-4-12 12-16 26-12 40 14-2 26 6 36 16-18 8-32 12-46 6 2 16-2 30-14 42-10-16-14-30-10-44-16 8-32 4-44-6 12-10 18-24 14-38-14-2-24-14-28-30 16 2 28 0 40-10-2-18 0-36 10-46z" />
          <path d="M50 104c2 30 2 56-2 84" fill="none" stroke="#1f5c42" strokeWidth="2.2" />
          </g>
        </g>

        <g fill="#12352c" opacity="0.13" transform="translate(1248,610)">
          <g className="flora">
          <path d="M72 8 100 54H44z" />
          <path d="M72 40 108 98H36z" />
          <path d="M72 78 118 148H26z" />
          <path d="M66 144h12v30H66z" />
          </g>
        </g>

        <g fill="#7a5b16" opacity="0.14" transform="translate(70,48) rotate(-20)">
          <g className="flora">
          <path d="M28 4c4 16 2 28-2 40 6-4 14-6 22-2-6 8-8 16-6 24 8 0 14 4 18 10-10 4-16 6-24 4 0 8-2 16-8 22-4-8-6-16-4-22-8 4-16 2-22-4 6-6 8-14 6-22-8 0-14-6-16-14 8 2 14 0 20-6-2-12 0-24 6-30z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

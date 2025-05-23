"use client"

export default function CSSOceanFallback() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {/* Ocean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-500 to-blue-900"></div>

      {/* Animated Waves */}
      <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Floating Containers */}
      <div className="absolute inset-0">
        <div className="floating-container container-orange" style={{ top: "60%", left: "10%", animationDelay: "0s" }}>
          <div className="container-details"></div>
        </div>
        <div className="floating-container container-blue" style={{ top: "65%", left: "25%", animationDelay: "1s" }}>
          <div className="container-details"></div>
        </div>
        <div className="floating-container container-red" style={{ top: "55%", left: "40%", animationDelay: "2s" }}>
          <div className="container-details"></div>
        </div>
        <div className="floating-container container-green" style={{ top: "70%", left: "60%", animationDelay: "3s" }}>
          <div className="container-details"></div>
        </div>
        <div className="floating-container container-orange" style={{ top: "58%", left: "75%", animationDelay: "4s" }}>
          <div className="container-details"></div>
        </div>
        <div className="floating-container container-blue" style={{ top: "62%", left: "85%", animationDelay: "5s" }}>
          <div className="container-details"></div>
        </div>
      </div>

      <style jsx>{`
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z' fill='%23ffffff' opacity='.3'/%3E%3C/svg%3E");
          background-size: 1200px 120px;
          background-repeat: repeat-x;
          animation: wave-animation 12s linear infinite;
        }
        
        .wave1 {
          animation-duration: 8s;
          opacity: 0.3;
        }
        
        .wave2 {
          animation-duration: 12s;
          opacity: 0.2;
          animation-direction: reverse;
        }
        
        .wave3 {
          animation-duration: 16s;
          opacity: 0.1;
        }
        
        @keyframes wave-animation {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .floating-container {
          position: absolute;
          width: 80px;
          height: 40px;
          border: 2px solid #1a1a1a;
          border-radius: 4px;
          animation: float-container 6s ease-in-out infinite;
          transform-origin: center;
        }
        
        .container-orange {
          background-color: #f97316;
        }
        
        .container-blue {
          background-color: #0ea5e9;
        }
        
        .container-red {
          background-color: #e11d48;
        }
        
        .container-green {
          background-color: #22c55e;
        }
        
        .container-details::before {
          content: "";
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          height: 3px;
          background-color: #1a1a1a;
        }
        
        .container-details::after {
          content: "";
          position: absolute;
          bottom: 8px;
          left: 8px;
          right: 8px;
          height: 3px;
          background-color: #1a1a1a;
        }
        
        @keyframes float-container {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  )
}

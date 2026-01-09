export const FogOverlay = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-5 overflow-hidden ${className}`}>
      {/* Bottom fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh] animate-fog-drift"
        style={{
          background: `linear-gradient(
            to top,
            hsla(0, 0%, 10%, 0.8) 0%,
            hsla(0, 0%, 10%, 0.4) 30%,
            hsla(357, 91%, 45%, 0.1) 60%,
            transparent 100%
          )`,
        }}
      />
      
      {/* Top fog layer */}
      <div
        className="absolute top-0 left-0 right-0 h-[30vh] animate-fog-drift"
        style={{
          animationDelay: '-10s',
          background: `linear-gradient(
            to bottom,
            hsla(0, 0%, 5%, 0.6) 0%,
            hsla(357, 91%, 45%, 0.05) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* Side vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 30%,
            hsla(0, 0%, 0%, 0.4) 70%,
            hsla(0, 0%, 0%, 0.8) 100%
          )`,
        }}
      />
    </div>
  );
};


export default function GlowingCard({ children }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 rounded-2xl bg-[linear-gradient(90deg,#800080,#ff0000,#ffff00)] bg-[length:200%_50%] 
        animate-[var(--animation-gradient-glow)] blur-sm opacity-0 group-hover:opacity-80">
      </div>
      <div className="relative p-2 rounded-2xl shadow-md items-center space-x-4 bg-bigbrain-milky-canvas  group-hover:bg-bigbrain-milky-white/95 ">
        {children}
      </div>
    </div>
  );
}
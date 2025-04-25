// src/components/LobbyRoom.jsx
import React from 'react';

export default function LobbyRoom() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      {/* Spinning ring */}
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-bigbrain-light-pink"></div>

      {/* Message */}
      <p className="text-xl font-bold">Waiting for the game to begin…</p>

      {/* Bouncing dots */}
      <div className="flex space-x-2 m-4">
        {[0,1,2].map(i => (
          <span
            key={i}
            className="inline-block h-3 w-3 bg-bigbrain-dark-pink rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

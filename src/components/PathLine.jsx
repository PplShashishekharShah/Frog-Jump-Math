import React, { useEffect, useRef } from 'react';

/**
 * PathLine — Draws an animated red SVG polyline connecting the frog's
 * start position to each selected lilypad.
 *
 * Props:
 *  - selected: array of pad indices currently selected
 *  - padPositions: array of { top, left } (percentage strings) for each pad index
 *  - boardWidth: number (px)
 *  - boardHeight: number (px)
 *  - startPos: { top, left } (percentage strings) — frog start position
 */
const PathLine = ({ selected, padPositions, boardWidth, boardHeight, startPos }) => {
  const svgRef = useRef(null);

  // Convert a percentage-based position object to pixel coords (center of pad)
  const toPixel = (posObj) => {
    const top = parseFloat(posObj.top) / 100 * boardHeight;
    const left = parseFloat(posObj.left) / 100 * boardWidth;
    return { x: left, y: top };
  };

  // Build the list of waypoints: start → each selected pad in order
  const waypoints = [startPos, ...selected.map((idx) => padPositions[idx])].filter(Boolean);

  if (waypoints.length < 2) return null;

  const points = waypoints.map(toPixel);
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Compute total path length for dash animation (approximate)
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 8,
        overflow: 'visible',
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow / glow layer */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="rgba(180,0,0,0.35)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: 0,
          animation: `drawPath ${0.35 * (waypoints.length - 1)}s ease-out forwards`,
        }}
      />

      {/* Main red line */}
      <polyline
        key={selected.join('-')}
        points={polylinePoints}
        fill="none"
        stroke="#e53935"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: totalLength,
          animation: `drawPath ${0.35 * (waypoints.length - 1)}s ease-out forwards`,
        }}
      />

      {/* Dots at each waypoint */}
      {points.slice(1).map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={6}
          fill="#e53935"
          stroke="#fff"
          strokeWidth={2}
          style={{
            filter: 'drop-shadow(0 0 4px #e53935)',
          }}
        />
      ))}

      <style>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
};

export default PathLine;

"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { GripHorizontal } from "lucide-react";
import type { ClothingItem } from "@/stores/wardrobeStore";

interface DraggableClothingProps {
  item: ClothingItem;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
  selected?: boolean;
  canvasWidth: number;
  canvasHeight: number;
  onMove: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
}

export function DraggableClothing({
  item,
  x,
  y,
  scale,
  rotation,
  zIndex,
  selected,
  canvasWidth,
  canvasHeight,
  onMove,
  onSelect,
}: DraggableClothingProps) {
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, itemX: 0, itemY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
      onSelect(item.id);
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        itemX: x,
        itemY: y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [item.id, x, y, onSelect],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      const newX = Math.max(0, Math.min(canvasWidth - 80, dragStart.current.itemX + dx));
      const newY = Math.max(0, Math.min(canvasHeight - 100, dragStart.current.itemY + dy));
      onMove(item.id, newX, newY);
    },
    [dragging, item.id, canvasWidth, canvasHeight, onMove],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const itemWidth = 80 * scale;
  const itemHeight = 100 * scale;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute touch-none cursor-grab active:cursor-grabbing group ${
        selected ? "z-50" : ""
      }`}
      style={{
        left: x,
        top: y,
        width: itemWidth,
        height: itemHeight,
        zIndex: selected ? 999 : zIndex,
        transform: `rotate(${rotation}deg)`,
        transition: dragging ? "none" : "transform 0.15s",
      }}
    >
      <div
        className={`relative w-full h-full rounded-lg overflow-hidden border-2 ${
          selected ? "border-rose-400 shadow-lg" : "border-gray-200 shadow-sm"
        }`}
      >
        <Image
          src={item.imageUrl}
          alt={item.category}
          fill
          className="object-cover"
          draggable={false}
          sizes="80px"
        />
      </div>
      {selected && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-400 text-white text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
          <GripHorizontal className="h-3 w-3 inline mr-0.5" />
          拖拽移动
        </div>
      )}
    </div>
  );
}
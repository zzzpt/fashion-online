"use client";

import { useCallback, useRef, useState } from "react";
import { Sparkles, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOutfitStore, type CanvasItem } from "@/stores/outfitStore";
import { useWardrobeStore, type ClothingItem } from "@/stores/wardrobeStore";
import { DraggableClothing } from "./DraggableClothing";

interface OutfitCanvasProps {
  clothingItems: ClothingItem[];
  onSave?: (items: CanvasItem[]) => void;
}

export function OutfitCanvas({ clothingItems, onSave }: OutfitCanvasProps) {
  const {
    currentCanvas,
    addToCanvas,
    removeFromCanvas,
    updateCanvasItem,
    clearCanvas,
    selectedBackground,
  } = useOutfitStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 360, h: 480 });

  const updateSize = useCallback(() => {
    if (canvasRef.current) {
      setCanvasSize({
        w: canvasRef.current.clientWidth,
        h: canvasRef.current.clientHeight,
      });
    }
  }, []);

  const handleCanvasRef = useCallback(
    (el: HTMLDivElement | null) => {
      (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      if (el) updateSize();
    },
    [updateSize],
  );

  function handleAddItem(item: ClothingItem) {
    const exists = currentCanvas.find((ci) => ci.clothingId === item.id);
    if (exists) {
      setSelectedId(item.id);
      return;
    }
    const cols = Math.floor(canvasSize.w / 90) || 4;
    const idx = currentCanvas.length;
    addToCanvas({
      clothingId: item.id,
      positionX: (idx % cols) * 90 + 5,
      positionY: Math.floor(idx / cols) * 110 + 5,
      scale: 1,
      rotation: 0,
      zIndex: idx,
    });
    setSelectedId(item.id);
  }

  function handleMove(id: string, newX: number, newY: number) {
    updateCanvasItem(id, { positionX: newX, positionY: newY });
  }

  return (
    <div className="space-y-3">
      {/* 画布 */}
      <div
        ref={handleCanvasRef}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100"
        style={{ backgroundColor: selectedBackground }}
      >
        {currentCanvas.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Sparkles className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400">从下方衣柜拖入衣物</p>
          </div>
        )}

        {currentCanvas.map((canvasItem) => {
          const clothing = clothingItems.find((ci) => ci.id === canvasItem.clothingId);
          if (!clothing) return null;
          return (
            <DraggableClothing
              key={canvasItem.clothingId}
              item={clothing}
              x={canvasItem.positionX}
              y={canvasItem.positionY}
              scale={canvasItem.scale}
              rotation={canvasItem.rotation}
              zIndex={canvasItem.zIndex}
              selected={selectedId === canvasItem.clothingId}
              canvasWidth={canvasSize.w}
              canvasHeight={canvasSize.h}
              onMove={handleMove}
              onSelect={setSelectedId}
            />
          );
        })}

        {/* 工具栏 */}
        {currentCanvas.length > 0 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 px-2 text-[10px] bg-white/80 backdrop-blur"
              onClick={clearCanvas}
            >
              <Undo2 className="h-3 w-3 mr-1" />
              清空
            </Button>
          </div>
        )}
      </div>

      {/* 衣物选择抽屉 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {clothingItems.map((item) => {
          const onCanvas = currentCanvas.find((ci) => ci.clothingId === item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleAddItem(item)}
              className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                onCanvas
                  ? "border-rose-400 opacity-70"
                  : "border-gray-100 hover:border-rose-200"
              }`}
            >
              <div
                className="w-full h-full bg-gray-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
            </button>
          );
        })}
      </div>

      {onSave && currentCanvas.length > 0 && (
        <Button
          className="w-full bg-rose-400 hover:bg-rose-500"
          onClick={() => onSave(currentCanvas)}
        >
          保存搭配
        </Button>
      )}
    </div>
  );
}
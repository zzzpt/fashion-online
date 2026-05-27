"use client";

import Image from "next/image";
import Link from "next/link";
import { Shirt } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface ClothingCardProps {
  id: string;
  imageUrl: string;
  category: string;
  isFavorite?: boolean;
  categoryLabel: string;
}

function imgSrc(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("data:")) return path;
  return `${API_BASE}${path}`;
}

export function ClothingCard({
  id,
  imageUrl,
  category,
  isFavorite,
  categoryLabel,
}: ClothingCardProps) {
  return (
    <Link href={`/wardrobe/${id}`} className="group">
      <div className="aspect-[3/4] rounded-xl bg-gray-100 overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imgSrc(imageUrl)}
            alt={category}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 480px) 33vw, 160px"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Shirt className="h-6 w-6 text-gray-300" />
          </div>
        )}
        {isFavorite && (
          <span className="absolute top-1.5 right-1.5 text-xs">❤️</span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1.5 truncate">{categoryLabel}</p>
    </Link>
  );
}
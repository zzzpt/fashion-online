"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "搜索衣物...",
  onSearch,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleToggle() {
    if (isOpen && query) {
      setQuery("");
      return;
    }
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) {
      onSearch?.(query.trim());
    }
    if (e.key === "Escape") {
      setQuery("");
      setIsOpen(false);
    }
  }

  return (
    <div className="flex items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 180, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="h-8 rounded-full border-rose-200 text-xs focus-visible:ring-rose-300"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={handleToggle}
        className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-rose-50 transition-colors ml-1"
        aria-label={isOpen && query ? "清除搜索" : "搜索"}
      >
        {isOpen && query ? (
          <X className="h-4 w-4 text-gray-400" />
        ) : (
          <Search className="h-4 w-4 text-gray-400" />
        )}
      </button>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Command, ArrowRight, Clock, User, FileText, Target, Wallet, Settings, Home, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'action' | 'search';
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  category: string;
}

const navigationItems: SearchResult[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Dashboard and overview',
    type: 'page',
    icon: <Home className="h-4 w-4" />,
    href: '/home',
    category: 'Navigation'
  },
  {
    id: 'ask',
    title: 'Find & Request Intel',
    description: 'Search for intel or request specific information',
    type: 'page',
    icon: <Search className="h-4 w-4" />,
    href: '/ask',
    category: 'Navigation'
  },
  {
    id: 'post-intel',
    title: 'Post Intel',
    description: 'Share your sales intelligence',
    type: 'page',
    icon: <Target className="h-4 w-4" />,
    href: '/post-intel',
    category: 'Navigation'
  },
  {
    id: 'history',
    title: 'History',
    description: 'View your transaction history',
    type: 'page',
    icon: <History className="h-4 w-4" />,
    href: '/history',
    category: 'Navigation'
  },
  {
    id: 'wallet',
    title: 'Wallet',
    description: 'Manage your credits and payments',
    type: 'page',
    icon: <Wallet className="h-4 w-4" />,
    href: '/wallet',
    category: 'Navigation'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Account and app preferences',
    type: 'page',
    icon: <Settings className="h-4 w-4" />,
    href: '/settings',
    category: 'Navigation'
  }
];

const actionItems: SearchResult[] = [
  {
    id: 'search-intel',
    title: 'Search Intel',
    description: 'Find existing sales intelligence',
    type: 'action',
    icon: <Search className="h-4 w-4" />,
    action: () => {
      // Focus on search input or open search modal
      const searchInput = document.querySelector('input[type="search"], [contenteditable="true"]') as HTMLElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    category: 'Actions'
  },
  {
    id: 'request-intel',
    title: 'Request Intel',
    description: 'Create a new intel request',
    type: 'action',
    icon: <FileText className="h-4 w-4" />,
    action: () => {
      // Open request modal or navigate to request page
      window.location.href = '/ask';
    },
    category: 'Actions'
  },
  {
    id: 'post-intel-action',
    title: 'Post Intel',
    description: 'Share your sales intelligence',
    type: 'action',
    icon: <Target className="h-4 w-4" />,
    action: () => {
      window.location.href = '/post-intel';
    },
    category: 'Actions'
  }
];

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allItems = [...navigationItems, ...actionItems];
  
  const filteredItems = allItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const selectedItem = filteredItems[selectedIndex];
          if (selectedItem) {
            handleItemSelect(selectedItem);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  const handleItemSelect = (item: SearchResult) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl border w-full max-w-2xl mx-4">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pages, actions, or intel..."
            className="border-0 shadow-none focus-visible:ring-0 text-lg"
          />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Command className="h-3 w-3" />
            <span>⌘K</span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found</p>
              <p className="text-sm">Try searching for pages, actions, or intel</p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {items.map((item, index) => {
                      const globalIndex = filteredItems.indexOf(item);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelect(item)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                            isSelected 
                              ? "bg-blue-50 border border-blue-200" 
                              : "hover:bg-gray-50"
                          )}
                        >
                          <div className="flex-shrink-0 text-gray-400">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {item.description}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {item.type === 'page' && (
                              <Badge variant="outline" className="text-xs">
                                Page
                              </Badge>
                            )}
                            {item.type === 'action' && (
                              <Badge variant="secondary" className="text-xs">
                                Action
                              </Badge>
                            )}
                          </div>
                          {isSelected && (
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Recent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

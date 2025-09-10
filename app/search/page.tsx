"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, User, Calendar, Tag } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  intel: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priceCredits: number;
    status: string;
    seller_name: string;
    reputation_score: number;
    similarity: number;
    createdAt: string;
  }>;
  demands: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    bountyCredits: number;
    status: string;
    buyer_name: string;
    similarity: number;
    createdAt: string;
  }>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setError('Search failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Search Results
          </h1>
          <p className="text-lg text-stone-600">
            Results for: <span className="font-medium">"{query}"</span>
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto"></div>
            <p className="mt-2 text-stone-600">Searching...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {results && !loading && (
          <div className="space-y-12">
            {/* Intel Results */}
            {results.intel.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-stone-900 mb-6">
                  Available Intel ({results.intel.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.intel.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                          <Badge variant={item.priceCredits === 0 ? "outline" : "secondary"}>
                            {item.priceCredits === 0 ? 'Free' : `$${item.priceCredits}`}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-500">
                          <User className="w-4 h-4" />
                          <span>{item.seller_name}</span>
                          <span>•</span>
                          <span>⭐ {item.reputation_score.toFixed(1)}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone-600 text-sm line-clamp-3 mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.category}</Badge>
                          <Button size="sm" asChild>
                            <Link href={`/intel/${item.id}`}>View Intel</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Demand Results */}
            {results.demands.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-stone-900 mb-6">
                  Open Demands ({results.demands.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.demands.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                          <Badge variant="default">${item.bountyCredits}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-500">
                          <User className="w-4 h-4" />
                          <span>{item.buyer_name}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone-600 text-sm line-clamp-3 mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.category}</Badge>
                          <Button size="sm" asChild>
                            <Link href={`/demand/${item.id}`}>View Demand</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {results.intel.length === 0 && results.demands.length === 0 && (
              <div className="text-center py-12">
                <p className="text-stone-600 text-lg mb-4">
                  No results found for "{query}"
                </p>
                <p className="text-stone-500">
                  Try different keywords or check back later for new intel and demands.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

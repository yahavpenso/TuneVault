import { useState } from "react";
import { Search, Music, ExternalLink, Loader2 } from "lucide-react";
import { SiYoutube, SiSoundcloud } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SearchResult, SearchRequest } from "@shared/schema";

export function SearchSection() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (data: SearchRequest) => {
      return await apiRequest<SearchResult[]>("POST", "/api/search", data);
    },
    onSuccess: () => {
      setHasSearched(true);
      queryClient.invalidateQueries({ queryKey: ["/api/search/recent"] });
    },
  });

  const { data: recentSearches } = useQuery<string[]>({
    queryKey: ["/api/search/recent"],
  });

  const handleSearch = () => {
    if (query.trim()) {
      searchMutation.mutate({ query: query.trim() });
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    searchMutation.mutate({ query: tag });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <SiYoutube className="h-4 w-4 text-[#FF0000]" />;
      case "soundcloud":
        return <SiSoundcloud className="h-4 w-4 text-[#FF5500]" />;
      default:
        return <Music className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 sm:p-8 shadow-lg border-card-border">
      <div className="space-y-6">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or artist..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 pl-10 font-body text-base border-2 focus-visible:ring-2 focus-visible:ring-secondary"
              disabled={searchMutation.isPending}
              data-testid="input-search"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending || !query.trim()}
            className="h-12 px-6 font-heading font-semibold"
            data-testid="button-search"
          >
            {searchMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {/* Popular/Recent Searches Tags */}
        {!hasSearched && recentSearches && recentSearches.length > 0 && (
          <div className="space-y-3">
            <p className="font-body text-sm font-medium text-muted-foreground">
              Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1.5 bg-muted hover-elevate active-elevate-2 rounded-full font-body text-sm text-foreground transition-all"
                  data-testid={`button-tag-${index}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchMutation.data && searchMutation.data.length > 0 && (
          <div className="space-y-3">
            <p className="font-body text-sm font-medium text-foreground">
              {searchMutation.data.length} result{searchMutation.data.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-3">
              {searchMutation.data.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start gap-4 p-4 bg-card hover-elevate rounded-lg border border-card-border transition-all"
                  data-testid={`card-result-${result.id}`}
                >
                  {result.thumbnail ? (
                    <img 
                      src={result.thumbnail} 
                      alt={result.title}
                      className="w-20 h-20 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center shrink-0">
                      <Music className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-heading text-base font-semibold text-foreground line-clamp-2">
                      {result.title}
                    </h4>
                    {result.artist && (
                      <p className="font-body text-sm text-muted-foreground line-clamp-1">
                        {result.artist}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="outline" className="font-body text-xs gap-1">
                        {getPlatformIcon(result.platform)}
                        {result.platform}
                      </Badge>
                      {result.duration && (
                        <span className="font-body text-xs text-muted-foreground">
                          {formatDuration(result.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => window.open(result.url, "_blank")}
                    title="Open in new tab"
                    data-testid={`button-open-${result.id}`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchMutation.data && searchMutation.data.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <Music className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="font-body text-base text-muted-foreground">
              No results found for "{query}"
            </p>
            <p className="font-body text-sm text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Error State */}
        {searchMutation.isError && (
          <div className="text-center py-8 space-y-2">
            <p className="font-body text-base text-destructive">
              Search failed. Please try again.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

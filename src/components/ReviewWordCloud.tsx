import { useMemo } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MessageSquare } from "lucide-react";
import { Review } from "../types/restaurant";

interface ReviewWordCloudProps {
  reviews: Review[];
}

// Common words to filter out (stop words)
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "up", "about", "into", "through", "during",
  "before", "after", "above", "below", "between", "under", "again", "further",
  "then", "once", "here", "there", "when", "where", "why", "how", "all",
  "both", "each", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "can", "will", "just", "should", "now", "i", "me", "my", "myself",
  "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
  "yourselves", "he", "him", "his", "himself", "she", "her", "hers",
  "herself", "it", "its", "itself", "they", "them", "their", "theirs",
  "themselves", "what", "which", "who", "whom", "this", "that", "these",
  "those", "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having", "do", "does", "did", "doing", "would",
  "could", "ought", "i'm", "you're", "he's", "she's", "it's", "we're",
  "they're", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd",
  "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll",
  "they'll", "isn't", "aren't", "wasn't", "weren't", "hasn't", "haven't",
  "hadn't", "doesn't", "don't", "didn't", "won't", "wouldn't", "shan't",
  "shouldn't", "can't", "cannot", "couldn't", "mustn't", "let's", "that's",
  "who's", "what's", "here's", "there's", "when's", "where's", "why's",
  "how's", "also", "got", "get", "really", "one", "two", "three", "went"
]);

export function ReviewWordCloud({ reviews }: ReviewWordCloudProps) {
  const wordFrequency = useMemo(() => {
    const frequency: { [key: string]: number } = {};
    
    reviews.forEach(review => {
      // Extract words from review comments
      const words = review.comment
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/) // Split by whitespace
        .filter(word => 
          word.length > 3 && // Only words longer than 3 characters
          !STOP_WORDS.has(word) && // Not a stop word
          !/^\d+$/.test(word) // Not a number
        );
      
      words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
      });
    });
    
    // Convert to array and sort by frequency
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30); // Take top 30 words
  }, [reviews]);

  if (reviews.length === 0) {
    return null;
  }

  // Calculate font sizes based on frequency
  const maxFrequency = Math.max(...wordFrequency.map(([_, freq]) => freq));
  const minFrequency = Math.min(...wordFrequency.map(([_, freq]) => freq));
  
  const getFontSize = (frequency: number) => {
    if (maxFrequency === minFrequency) return 16;
    const normalized = (frequency - minFrequency) / (maxFrequency - minFrequency);
    return Math.floor(12 + normalized * 28); // Font size between 12px and 40px
  };

  const getColor = (frequency: number) => {
    if (maxFrequency === minFrequency) return "text-blue-600 dark:text-blue-400";
    const normalized = (frequency - minFrequency) / (maxFrequency - minFrequency);
    
    if (normalized > 0.7) return "text-blue-600 dark:text-blue-400";
    if (normalized > 0.4) return "text-green-600 dark:text-green-400";
    if (normalized > 0.2) return "text-yellow-600 dark:text-yellow-400";
    return "text-muted-foreground";
  };

  const getOpacity = (frequency: number) => {
    if (maxFrequency === minFrequency) return 1;
    const normalized = (frequency - minFrequency) / (maxFrequency - minFrequency);
    return 0.5 + (normalized * 0.5); // Opacity between 0.5 and 1
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-foreground">Common Review Topics</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Most frequently mentioned words from {reviews.length} review{reviews.length !== 1 ? 's' : ''}
      </p>

      {wordFrequency.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Not enough review data to generate word cloud
        </p>
      ) : (
        <div className="flex flex-wrap gap-3 items-center justify-center py-4">
          {wordFrequency.map(([word, frequency]) => (
            <span
              key={word}
              className={`font-medium hover:scale-110 transition-transform cursor-default ${getColor(frequency)}`}
              style={{
                fontSize: `${getFontSize(frequency)}px`,
                opacity: getOpacity(frequency),
                fontWeight: frequency > maxFrequency * 0.5 ? 600 : 500,
              }}
              title={`Mentioned ${frequency} time${frequency !== 1 ? 's' : ''}`}
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span>Most mentioned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span>Often mentioned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-600" />
          <span>Sometimes mentioned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <span>Rarely mentioned</span>
        </div>
      </div>
    </Card>
  );
}

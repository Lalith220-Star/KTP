import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";
import { Label } from "./ui/label";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  restaurantName: string;
}

export function ReviewDialog({ open, onClose, onSubmit, restaurantName }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {restaurantName}</DialogTitle>
          <DialogDescription>
            Share your experience with this restaurant
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="mb-2 block">Your Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="comment" className="mb-2 block">
              Your Review (Optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Tell others about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

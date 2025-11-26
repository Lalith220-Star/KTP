import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface BusinessData {
  name: string;
  cuisine: string;
  address: string;
  priceRange: string;
  phone: string;
  description: string;
}

interface AddBusinessFormProps {
  onSubmit: (data: BusinessData) => void;
  existingBusiness?: BusinessData | null;
}

export function AddBusinessForm({ onSubmit, existingBusiness }: AddBusinessFormProps) {
  const [formData, setFormData] = useState<BusinessData>(existingBusiness || {
    name: "",
    cuisine: "",
    address: "",
    priceRange: "$",
    phone: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof BusinessData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <h3 className="text-foreground mb-6">
        {existingBusiness ? "Edit Your Business" : "Add Your Business"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="The Golden Spoon"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Type *</Label>
            <Select value={formData.cuisine} onValueChange={(value) => handleChange("cuisine", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fine Dining">Fine Dining</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Café">Café</SelectItem>
                <SelectItem value="Seafood">Seafood</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceRange">Price Range *</Label>
            <Select value={formData.priceRange} onValueChange={(value) => handleChange("priceRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">$ (Budget-friendly)</SelectItem>
                <SelectItem value="$$">$$ (Moderate)</SelectItem>
                <SelectItem value="$$$">$$$ (Upscale)</SelectItem>
                <SelectItem value="$$$$">$$$$ (Fine Dining)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="123 Market St, San Francisco, CA 94103"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Tell customers about your restaurant..."
            rows={4}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {existingBusiness ? "Update Business" : "Add Business"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

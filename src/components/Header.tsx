import { MapPin, Search, User, Building2, LogOut, PlusCircle, Settings, HelpCircle, FileText, UserCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { DarkModeToggle } from "./DarkModeToggle";
import { LocationSelector, Location } from "./LocationSelector";

interface HeaderProps {
  user: { email: string; isBusiness: boolean } | null;
  onSignInClick: () => void;
  onSignOut: () => void;
  onDashboardClick: () => void;
  onAddBusinessClick: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLegalClick?: () => void;
  currentView: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  currentLocation?: Location;
  onLocationChange?: (location: Location) => void;
}

export function Header({ 
  user, 
  onSignInClick, 
  onSignOut, 
  onDashboardClick, 
  onAddBusinessClick, 
  onProfileClick,
  onSettingsClick,
  onHelpClick,
  onLegalClick,
  currentView, 
  searchQuery = "", 
  onSearchChange,
  currentLocation,
  onLocationChange
}: HeaderProps) {
  return (
    <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => currentView !== "home" && onDashboardClick()}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-600 dark:text-blue-400">Localytics</h1>
              <p className="text-xs text-muted-foreground">Data-driven dining decisions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Location Selector */}
            {currentLocation && onLocationChange && (
              <LocationSelector
                currentLocation={currentLocation}
                onLocationChange={onLocationChange}
              />
            )}
            
            {/* Help Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onHelpClick}
              className="hidden md:flex"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            
            {/* Add Your Business Button */}
            {user ? (
              !user.isBusiness && (
                <Button 
                  onClick={onAddBusinessClick} 
                  variant="outline"
                  className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden md:inline">Add Your Business</span>
                </Button>
              )
            ) : (
              <Button 
                onClick={onAddBusinessClick} 
                variant="outline"
                className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden md:inline">Add Your Business</span>
              </Button>
            )}
            
            <DarkModeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {user.isBusiness ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isBusiness && (
                    <>
                      <DropdownMenuItem onClick={onDashboardClick}>
                        <Building2 className="w-4 h-4 mr-2" />
                        Business Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {!user.isBusiness && (
                    <DropdownMenuItem onClick={onProfileClick}>
                      <UserCircle className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onSettingsClick}>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onHelpClick}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLegalClick}>
                    <FileText className="w-4 h-4 mr-2" />
                    Terms & Privacy
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onSignInClick} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        {currentView === "home" && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search restaurants by name, cuisine, or location..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
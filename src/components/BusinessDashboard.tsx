import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, TrendingDown, Award, Users, Star, AlertCircle, Eye, BarChart3, Zap, Activity, Database } from "lucide-react";
import { Button } from "./ui/button";
import { AddBusinessForm } from "./AddBusinessForm";
import { CompetitiveBenchmark } from "./CompetitiveBenchmark";
import { Watchlist } from "./Watchlist";
import { LBHScoreExplainer } from "./LBHScoreExplainer";
import { OperationalInsights } from "./OperationalInsights";
import { ScoreTrends } from "./ScoreTrends";
import { DataSourcesInfo } from "./DataSourcesInfo";
import { LBHScoreGauge } from "./LBHScoreGauge";
import { CompetitiveBenchmarkChart } from "./CompetitiveBenchmarkChart";
import { Restaurant } from "../types/restaurant";
import { useState } from "react";

interface BusinessDashboardProps {
  restaurants: Restaurant[];
  userBusiness: Restaurant | null;
  onAddBusiness: (data: any) => void;
  watchlist: number[];
  onToggleWatchlist: (restaurantId: number) => void;
  onViewRestaurantDetail: (restaurant: Restaurant) => void;
}

export function BusinessDashboard({ 
  restaurants, 
  userBusiness, 
  onAddBusiness,
  watchlist,
  onToggleWatchlist,
  onViewRestaurantDetail
}: BusinessDashboardProps) {
  const [showForm, setShowForm] = useState(!userBusiness);

  if (!userBusiness) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 mb-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-foreground mb-3">Localytics Operational Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Stop relying on costly trial-and-error. Get objective, data-driven insights about your restaurant's operational health.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-background rounded-lg">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="text-foreground mb-2">Root Cause Diagnosis</h4>
                <p className="text-sm text-muted-foreground">
                  Not just complaints—understand exactly what's causing issues
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="text-foreground mb-2">Local Benchmarking</h4>
                <p className="text-sm text-muted-foreground">
                  Compare against competitors to identify weaknesses
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <Database className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="text-foreground mb-2">Public Data Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Reviews, job posts, hours—aggregated into actionable insights
                </p>
              </div>
            </div>
          </div>
        </Card>
        <div className="mb-6">
          <h2 className="text-foreground mb-2">Claim Your Business</h2>
          <p className="text-muted-foreground">
            Start tracking your Local Business Health Score and get personalized improvement recommendations
          </p>
        </div>
        <AddBusinessForm 
          onSubmit={(data) => {
            onAddBusiness(data);
            setShowForm(false);
          }} 
        />
      </div>
    );
  }

  const sortedRestaurants = [...restaurants].sort((a, b) => b.overallScore - a.overallScore);
  const userRank = sortedRestaurants.findIndex(r => r.id === userBusiness.id) + 1;
  const totalRestaurants = sortedRestaurants.length;
  const topPercentile = Math.round((1 - (userRank / totalRestaurants)) * 100);

  const averageScores = {
    overall: Math.round(restaurants.reduce((sum, r) => sum + r.overallScore, 0) / restaurants.length),
    foodQuality: Math.round(restaurants.reduce((sum, r) => sum + r.factors[0].score, 0) / restaurants.length),
    service: Math.round(restaurants.reduce((sum, r) => sum + r.factors[1].score, 0) / restaurants.length),
    ambiance: Math.round(restaurants.reduce((sum, r) => sum + r.factors[2].score, 0) / restaurants.length),
  };

  const getComparison = (yourScore: number, avgScore: number) => {
    const diff = yourScore - avgScore;
    if (diff > 0) {
      return { trend: "up", text: `+${diff} above average`, color: "text-blue-600" };
    } else if (diff < 0) {
      return { trend: "down", text: `${diff} below average`, color: "text-muted-foreground" };
    }
    return { trend: "neutral", text: "At average", color: "text-muted-foreground" };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* DEBUG MARKER - REMOVE LATER */}
      <div className="mb-4 p-4 bg-yellow-200 border-4 border-red-500 text-black rounded-lg">
        <h1 className="text-2xl font-bold">✅ NEW BUSINESS DASHBOARD LOADED - YOU SHOULD SEE THE GAUGE BELOW</h1>
        <p>Score: {userBusiness.overallScore} | Business: {userBusiness.name}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-foreground mb-2">{userBusiness.name}</h2>
            <p className="text-muted-foreground">
              Operational Intelligence Dashboard - Powered by Public Data Analytics
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Hide Form" : "Edit Business"}
          </Button>
        </div>

        {/* Critical Issues Alert Banner */}
        {(() => {
          const sameTypeRestaurants = restaurants.filter(
            r => r.cuisine === userBusiness.cuisine && r.id !== userBusiness.id
          );
          const criticalIssues = userBusiness.factors.filter(factor => {
            const avgScore = sameTypeRestaurants.length > 0
              ? Math.round(
                  sameTypeRestaurants.reduce((sum, r) => {
                    const f = r.factors.find(rf => rf.name === factor.name);
                    return sum + (f?.score || 0);
                  }, 0) / sameTypeRestaurants.length
                )
              : 0;
            return (factor.score - avgScore) < -5 && factor.score < 75;
          });

          if (criticalIssues.length > 0) {
            return (
              <Card className="mb-4 p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-foreground mb-1">
                      {criticalIssues.length} Critical {criticalIssues.length === 1 ? 'Issue' : 'Issues'} Detected
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Our analysis identified operational weaknesses significantly below your local competitors.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {criticalIssues.map((issue, idx) => (
                        <Badge key={idx} variant="destructive">
                          {issue.name}: {issue.score}/100
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                    onClick={() => {
                      const tabsList = document.querySelector('[role="tablist"]');
                      const insightsTab = tabsList?.querySelector('[value="insights"]') as HTMLElement;
                      insightsTab?.click();
                    }}
                  >
                    View Solutions
                  </Button>
                </div>
              </Card>
            );
          }
          return null;
        })()}

        {showForm && (
          <div className="mb-8">
            <AddBusinessForm 
              existingBusiness={{
                name: userBusiness.name,
                cuisine: userBusiness.cuisine,
                address: userBusiness.address,
                priceRange: userBusiness.priceRange,
                phone: "(555) 123-4567",
                description: "Your business description",
              }}
              onSubmit={(data) => {
                onAddBusiness(data);
                setShowForm(false);
              }} 
            />
          </div>
        )}
      </div>

      {/* LBH Score Header with Critical Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Semi-Circle Gauge with Score Breakdown */}
        <LBHScoreGauge
          score={userBusiness.overallScore}
          comparisonText={getComparison(userBusiness.overallScore, averageScores.overall).text}
          comparisonTrend={getComparison(userBusiness.overallScore, averageScores.overall).trend as "up" | "down" | "neutral"}
          showBreakdown={true}
          customerSentiment={Math.round((userBusiness.factors[0]?.score || 85) * 0.4 + (userBusiness.factors[1]?.score || 85) * 0.3 + (userBusiness.factors[2]?.score || 85) * 0.3)}
          operationalConsistency={Math.round((userBusiness.factors[3]?.score || 85) * 0.5 + (userBusiness.factors[4]?.score || 85) * 0.5)}
          talentStability={Math.round((userBusiness.factors[5]?.score || 85) * 0.6 + (userBusiness.factors[1]?.score || 85) * 0.4)}
        />

        {/* LBH Explanation Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              What is LBH Score?
            </h3>
            <LBHScoreExplainer score={userBusiness.overallScore} factors={userBusiness.factors} />
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-sm text-foreground mb-1">Customer Sentiment</h4>
                <p className="text-xs text-muted-foreground">
                  Review analysis & satisfaction trends
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm text-foreground mb-1">Operational Consistency</h4>
                <p className="text-xs text-muted-foreground">
                  Hours stability & response patterns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm text-foreground mb-1">Talent Stability</h4>
                <p className="text-xs text-muted-foreground">
                  Job posting frequency & tenure indicators
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Critical Insight Card */}
        <Card className="p-6 border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h4 className="text-foreground">Priority Action</h4>
          </div>
          {(() => {
            const sameTypeRestaurants = restaurants.filter(
              r => r.cuisine === userBusiness.cuisine && r.id !== userBusiness.id
            );
            const lowestFactor = [...userBusiness.factors].sort((a, b) => a.score - b.score)[0];
            const avgScore = sameTypeRestaurants.length > 0
              ? Math.round(
                  sameTypeRestaurants.reduce((sum, r) => {
                    const f = r.factors.find(rf => rf.name === lowestFactor.name);
                    return sum + (f?.score || 0);
                  }, 0) / sameTypeRestaurants.length
                )
              : 0;
            const diff = lowestFactor.score - avgScore;
            
            return (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  Your weakest area:
                </div>
                <div className="text-2xl text-orange-600 dark:text-orange-400 mb-2">
                  {lowestFactor.name}
                </div>
                <div className="text-sm text-foreground mb-3">
                  Score: {lowestFactor.score}/100
                  {diff < 0 && (
                    <span className="text-red-600 dark:text-red-400">
                      {" "}({diff} vs avg)
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    const tabsList = document.querySelector('[role="tablist"]');
                    const insightsTab = tabsList?.querySelector('[value="insights"]') as HTMLElement;
                    insightsTab?.click();
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  View Root Cause
                </Button>
              </>
            );
          })()}
        </Card>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {watchlist.length}
            </Badge>
          </div>
          <h3 className="text-foreground mb-1">Watchlist</h3>
          <p className="text-sm text-muted-foreground">
            Tracked competitors
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              #{userRank}
            </Badge>
          </div>
          <h3 className="text-foreground mb-1">Ranking</h3>
          <p className="text-sm text-muted-foreground">
            Top {topPercentile}% of {totalRestaurants} restaurants
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {Math.floor(Math.random() * 500) + 200}
            </Badge>
          </div>
          <h3 className="text-foreground mb-1">Monthly Views</h3>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+12% this month</span>
          </div>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
          <TabsTrigger value="insights" className="gap-1 text-xs lg:text-sm">
            <Zap className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-1 text-xs lg:text-sm">
            <Activity className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="benchmark" className="gap-1 text-xs lg:text-sm">
            <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Benchmark</span>
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="gap-1 text-xs lg:text-sm">
            <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Watchlist</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-1 text-xs lg:text-sm">
            <Star className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-1 text-xs lg:text-sm">
            <Database className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Competitive Benchmarking Chart */}
          <CompetitiveBenchmarkChart
            data={[
              {
                label: "Customer Sentiment",
                yourScore: Math.round((userBusiness.factors[0]?.score || 85) * 0.4 + (userBusiness.factors[1]?.score || 85) * 0.3 + (userBusiness.factors[2]?.score || 85) * 0.3),
                localAverage: 72,
                topCompetitor: sortedRestaurants[0]?.id === userBusiness.id ? 
                  Math.round((sortedRestaurants[1]?.factors[0]?.score || 90) * 0.4 + (sortedRestaurants[1]?.factors[1]?.score || 90) * 0.3) :
                  Math.round((sortedRestaurants[0]?.factors[0]?.score || 95) * 0.4 + (sortedRestaurants[0]?.factors[1]?.score || 95) * 0.3)
              },
              {
                label: "Operational Consistency",
                yourScore: Math.round((userBusiness.factors[3]?.score || 85) * 0.5 + (userBusiness.factors[4]?.score || 85) * 0.5),
                localAverage: 75,
                topCompetitor: sortedRestaurants[0]?.id === userBusiness.id ?
                  Math.round((sortedRestaurants[1]?.factors[3]?.score || 92) * 0.5 + (sortedRestaurants[1]?.factors[4]?.score || 92) * 0.5) :
                  Math.round((sortedRestaurants[0]?.factors[3]?.score || 93) * 0.5 + (sortedRestaurants[0]?.factors[4]?.score || 93) * 0.5)
              },
              {
                label: "Talent Stability",
                yourScore: Math.round((userBusiness.factors[5]?.score || 85) * 0.6 + (userBusiness.factors[1]?.score || 85) * 0.4),
                localAverage: 68,
                topCompetitor: sortedRestaurants[0]?.id === userBusiness.id ?
                  Math.round((sortedRestaurants[1]?.factors[5]?.score || 88) * 0.6 + (sortedRestaurants[1]?.factors[1]?.score || 88) * 0.4) :
                  Math.round((sortedRestaurants[0]?.factors[5]?.score || 91) * 0.6 + (sortedRestaurants[0]?.factors[1]?.score || 91) * 0.4)
              }
            ]}
          />

          <OperationalInsights
            userBusiness={userBusiness}
            allRestaurants={restaurants}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <ScoreTrends userBusiness={userBusiness} />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Breakdown */}
          <Card className="p-6">
            <h3 className="text-foreground mb-6">Performance Breakdown</h3>
            
            <div className="space-y-6">
              {userBusiness.factors.map((factor, index) => {
                const avgScore = index === 0 ? averageScores.foodQuality : 
                               index === 1 ? averageScores.service : 
                               index === 2 ? averageScores.ambiance : 
                               Math.round(restaurants.reduce((sum, r) => sum + r.factors[index].score, 0) / restaurants.length);
                const comparison = getComparison(factor.score, avgScore);

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-foreground">{factor.name}</span>
                        <span className={`text-sm ${comparison.color}`}>{comparison.text}</span>
                      </div>
                      <span className="text-foreground">{factor.score}/100</span>
                    </div>
                    <div className="relative">
                      <Progress value={factor.score} className="h-3" />
                      <div 
                        className="absolute top-0 h-3 w-0.5 bg-muted-foreground/40"
                        style={{ left: `${avgScore}%` }}
                        title={`Industry average: ${avgScore}`}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Your score</span>
                      <span className="text-xs text-muted-foreground">Industry avg: {avgScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Leaderboard */}
          <Card className="p-6">
            <h3 className="text-foreground mb-6">Leaderboard</h3>
            
            <div className="space-y-4">
              {sortedRestaurants.slice(0, 5).map((restaurant, index) => {
                const isUserBusiness = restaurant.id === userBusiness.id;
                const isInWatchlist = watchlist.includes(restaurant.id);
                return (
                  <div 
                    key={restaurant.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      isUserBusiness ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" : "bg-muted border-border"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isUserBusiness ? "bg-blue-600 text-white" : "bg-background text-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{restaurant.name}</span>
                        {isUserBusiness && <Badge variant="secondary">You</Badge>}
                      </div>
                      <span className="text-sm text-muted-foreground">{restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl text-foreground">{restaurant.overallScore}</div>
                        <span className="text-xs text-muted-foreground">LBH Score</span>
                      </div>
                      {!isUserBusiness && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleWatchlist(restaurant.id)}
                          className="gap-2"
                        >
                          <Eye className={`w-4 h-4 ${isInWatchlist ? "fill-blue-600 text-blue-600" : ""}`} />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Improvement Suggestions */}
          <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-foreground mb-2">Suggestions for Improvement</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {userBusiness.factors
                    .map((f, i) => ({ ...f, index: i }))
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 2)
                    .map(factor => (
                      <li key={factor.index} className="text-foreground">
                        • Focus on improving <strong>{factor.name}</strong> - currently at {factor.score}/100
                      </li>
                    ))}
                  <li className="text-foreground">• Encourage customers to leave reviews to improve visibility</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="benchmark">
          <CompetitiveBenchmark 
            userBusiness={userBusiness}
            allRestaurants={restaurants}
          />
        </TabsContent>

        <TabsContent value="watchlist">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Track competitors and other businesses to monitor their LBH Score changes over time. 
              Add restaurants from the leaderboard or main listing.
            </p>
          </div>
          <Watchlist
            watchedRestaurants={restaurants.filter(r => watchlist.includes(r.id))}
            onRemoveFromWatchlist={onToggleWatchlist}
            onViewDetails={onViewRestaurantDetail}
          />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataSourcesInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
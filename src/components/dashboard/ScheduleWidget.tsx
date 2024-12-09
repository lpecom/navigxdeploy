import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks } from "date-fns";
import { DashboardCheckoutSession, SelectedCarData } from "@/types/dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ScheduleWidget = () => {
  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ['upcoming-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          id,
          reservation_number,
          pickup_date,
          pickup_time,
          driver:driver_details(full_name),
          selected_car,
          created_at,
          status
        `)
        .gte('pickup_date', new Date().toISOString())
        .order('pickup_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        driver: item.driver?.[0] || null // Convert array to single object
      })) as DashboardCheckoutSession[];
    },
  });

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  });

  const nextWeekDays = eachDayOfInterval({
    start: startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }),
    end: endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }),
  });

  if (error) {
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load schedule. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-0 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0 px-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold tracking-tight">Schedule</h3>
          <Badge variant="secondary" className="rounded-full px-2.5">
            {isLoading ? '...' : schedules?.length || 0}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-gray-100/80 p-1">
            <Button variant="ghost" size="sm" className="text-sm px-3">Day</Button>
            <Button variant="default" size="sm" className="text-sm px-3">Week</Button>
            <Button variant="ghost" size="sm" className="text-sm px-3">Month</Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-50/80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {[weekDays, nextWeekDays].map((days, weekIndex) => (
                <div key={weekIndex} className="space-y-4">
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                      const daySchedules = schedules?.filter(
                        s => s.pickup_date === format(day, 'yyyy-MM-dd')
                      );
                      const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

                      return (
                        <div key={i} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1.5">
                            {format(day, 'EEE')}
                          </div>
                          <button 
                            className={cn(
                              "w-9 h-9 rounded-full mx-auto flex items-center justify-center text-sm relative group",
                              "transition-all duration-200 hover:bg-gray-100",
                              isToday && "bg-primary text-white hover:bg-primary/90",
                              daySchedules?.length && !isToday && "font-medium"
                            )}
                          >
                            {format(day, 'd')}
                            {daySchedules?.length > 0 && !isToday && (
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-1">
                    {schedules
                      ?.filter(s => days.some(d => 
                        format(d, 'yyyy-MM-dd') === s.pickup_date
                      ))
                      .map((schedule) => {
                        const selectedCar = schedule.selected_car as unknown as SelectedCarData;
                        
                        return (
                          <div
                            key={schedule.id}
                            className="group flex items-center gap-3 p-3 -mx-2 rounded-lg hover:bg-gray-50/80 transition-all duration-200"
                          >
                            <div className="w-12 text-sm font-medium text-muted-foreground group-hover:text-gray-900 transition-colors">
                              {schedule.pickup_time}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {schedule.driver?.full_name}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {selectedCar?.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
              
              {(!schedules || schedules.length === 0) && (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No schedules found</p>
                  <p className="text-sm text-muted-foreground mt-1">New schedules will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleWidget;
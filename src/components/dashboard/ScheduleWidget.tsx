import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks } from "date-fns";

const ScheduleWidget = () => {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['upcoming-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          id,
          pickup_date,
          pickup_time,
          driver:driver_details(full_name),
          selected_car
        `)
        .gte('pickup_date', new Date().toISOString())
        .order('pickup_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data;
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

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Schedule</h3>
          <Badge variant="secondary" className="rounded-full">
            {isLoading ? '...' : schedules?.length || 0}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <Button variant="ghost" size="sm" className="text-sm">Day</Button>
            <Button variant="default" size="sm" className="text-sm">Week</Button>
            <Button variant="ghost" size="sm" className="text-sm">Month</Button>
          </div>
          <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary">
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-50 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {[weekDays, nextWeekDays].map((days, weekIndex) => (
                <div key={weekIndex} className="space-y-2">
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                      const daySchedules = schedules?.filter(
                        s => s.pickup_date === format(day, 'yyyy-MM-dd')
                      );
                      const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

                      return (
                        <div key={i} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            {format(day, 'EEE')}
                          </div>
                          <div className={`
                            rounded-full w-8 h-8 mx-auto flex items-center justify-center text-sm
                            ${isToday ? 'bg-primary text-white' : 'hover:bg-gray-100 cursor-pointer'}
                            ${daySchedules?.length ? 'font-semibold' : ''}
                          `}>
                            {format(day, 'd')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-1">
                    {schedules
                      ?.filter(s => days.some(d => 
                        format(d, 'yyyy-MM-dd') === s.pickup_date
                      ))
                      .map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-12 text-sm text-muted-foreground">
                            {schedule.pickup_time}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {schedule.driver?.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {schedule.selected_car?.name}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleWidget;
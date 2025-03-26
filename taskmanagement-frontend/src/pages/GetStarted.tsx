import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function GetStarted() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center h-screen">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md scale-85"
        />
        <div className="flex flex-col gap-4 md:gap-14">
          <h1 className="text-2xl md:text-4xl font-bold">
            <div>Keep it</div>
            <div>under control</div>
            <div>Stay focused always!</div>
          </h1>
          <Button
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </>
  );
}

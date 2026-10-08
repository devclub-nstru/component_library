"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export function ToasterDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full select-none p-2">
      <Toaster />
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Default Toast
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.success("Success!", {
              description: "Your action was completed successfully",
            })
          }
        >
          Success Toast
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.error("Error!", {
              description: "Something went wrong. Please try again.",
            })
          }
        >
          Error Toast
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
              loading: "Loading...",
              success: "Promise resolved",
              error: "Promise rejected",
            })
          }
        >
          Promise Toast
        </Button>
      </div>
    </div>
  );
}

export { Toaster, toast };
export default ToasterDemo;

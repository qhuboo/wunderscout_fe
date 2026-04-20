"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadWithProgress } from "@/lib/utils";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { X } from "lucide-react";

export default function GameUploadForm() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { ws, messages } = useWebSocket();
  const jobIdRef = useRef<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      file: null as File | null,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/jobs/upload-url`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contentType: value.file?.type,
              fileName: value.file?.name,
            }),
          },
        );

        if (!res.ok) {
          console.log(
            "FE[GameUploadForm][form][onSubmit]: Presign failed.",
            await res.text(),
          );
          return;
        }

        const { url, jobId, key } = await res.json();
        jobIdRef.current = jobId;
        console.log("FE[GameUploadForm][form][onSubmit]: URL: ", url);

        if (!value.file) {
          alert("Please choose a file.");
          return;
        }

        const result = await uploadWithProgress(value.file, url, (percent) => {
          setProgress(Math.round(percent));
        });

        console.log("Result: ", result);

        if (result.status === "success") {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/jobs`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ jobId, key }),
            },
          );

          if (ws?.readyState === WebSocket.OPEN) {
            console.log("FE: Subscribing to job.");
            ws.send(JSON.stringify({ jobId }));
          }
        }
      } catch (error) {
        console.log("Error uploading video: ", error);
      }
    },
  });

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];

    if (
      jobIdRef.current &&
      latestMessage?.jobId === jobIdRef.current &&
      latestMessage?.status === "completed"
    ) {
      setOpen(false);
      form.reset();
      console.log(
        "FE[GameUploadForm][useEffect]: latestMessage: ",
        latestMessage,
      );
      router.push(`/${latestMessage?.gameId}?type=logo`);
      jobIdRef.current = null;
    }
  }, [messages, router, form]);

  console.log("FE[GameUploadForm][render]: WebSocket Messages: ", messages);
  const latestMessage = messages[messages.length - 1];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-black border-2 border-green-500 text-green-500 font-mono font-bold text-sm uppercase px-6 py-3 tracking-wider hover:bg-green-500 hover:text-black transition-all duration-200 shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.6)] active:shadow-[0_0_5px_rgba(0,255,0,0.8)] active:translate-y-px">
          ▶ Upload Game
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Upload Game Video
          </Dialog.Title>

          <Dialog.Description className="text-sm text-muted-foreground mb-6">
            Upload a game video to analyze player movements and generate
            heatmaps.
          </Dialog.Description>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="title"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Game title"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />

            <form.Field
              name="description"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Optional description"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />

            <form.Field
              name="file"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="file">Video File</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    name="file"
                    id="file"
                    className="cursor-pointer"
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const f = e.currentTarget.files?.[0] ?? null;
                      field.handleChange(f);
                    }}
                  />
                </div>
              )}
            />

            {progress > 0 && progress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {progress === 100 && (
              <p className="text-green-600 text-sm">✅ Upload complete!</p>
            )}

            {latestMessage && (
              <div className="p-3 bg-muted rounded text-sm">
                <span className="font-medium">Status:</span>{" "}
                {latestMessage.status}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={progress > 0 && progress < 100}>
                {progress > 0 && progress < 100 ? "Uploading..." : "Submit"}
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

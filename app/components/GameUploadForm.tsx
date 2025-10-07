"use client";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadWithProgress } from "@/lib/utils";
import { useWebSocket } from "@/contexts/WebSocketContext";

export default function GameUploadForm() {
	const [progress, setProgess] = useState(0);
	const { ws, messages } = useWebSocket();
	console.log("FE: WebSocket Messages: ", messages);
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			file: null as File | null,
		},
		onSubmit: async ({ value }) => {
			try {
				const res = await fetch("http://localhost:4000/upload-url", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						contentType: value.file?.type,
						fileName: value.file?.name,
					}),
				});

				if (!res.ok) {
					console.log("Presign failed.", await res.text());
				}

				const { url, jobId, key } = await res.json();
				console.log("URL: ", url);

				if (!value.file) {
					alert("Please choose a file.");
					return;
				}

				const result = await uploadWithProgress(value.file, url, (percent) => {
					setProgess(percent);
				});

				console.log("Result: ", result);

				if (result.status === "success") {
					const res = await fetch("http://localhost:4000/jobs", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ jobId, key }),
					});

					if (ws?.readyState === WebSocket.OPEN) {
						console.log("FE: Subscribing to job.");
						ws.send(JSON.stringify({ jobId }));
					}
				}
			} catch (error) {
				console.log("Error uploading video: ", error);
				return;
			}
		},
	});
	return (
		<Card className="bg-card">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<CardTitle>This is the card title.</CardTitle>
				<CardHeader>This is the card header.</CardHeader>
				<CardDescription>This is the description.</CardDescription>
				<CardContent className="border-2 border-red-500">
					<form.Field
						name="title"
						children={(field) => (
							<div className="w-fit ">
								<Label htmlFor="title">Title</Label>
								<Input
									type="text"
									name="title"
									id="title"
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
							<div className="w-fit">
								<Label htmlFor="description">Description</Label>
								<Input
									type="text"
									name="description"
									id="description"
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
							<div className="w-fit">
								<Label htmlFor="file">File</Label>
								<Input
									type="file"
									// accept="video/*"
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
				</CardContent>
				<CardAction>
					<Button type="submit" variant="outline">
						Submit
					</Button>
				</CardAction>
				<CardFooter>
					{progress > 0 && progress < 100 && (
						<div className="w-full bg-gray-200 rounded h-4">
							<div
								className="bg-green-500 h-4 rounded"
								style={{ width: `${progress}%` }}
							/>
						</div>
					)}
					{progress === 100 && <p>✅ Upload complete!</p>}
          <div>
            {messages.length > 1 && messages[messages.length - 1]?.status}
          </div>
				</CardFooter>
			</form>
		</Card>
	);
}

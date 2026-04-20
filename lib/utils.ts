import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uploadWithProgress(
  file: File,
  url: string,
  onProgress: (percent: number) => void,
): Promise<{ status: "success" }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
        console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("Upload complete!");
        console.log("Response: ", xhr.responseText);
        resolve({ status: "success" });
      } else {
        reject(
          new Error(
            `Upload failed with status ${xhr.status}: ${xhr.statusText}`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred during upload"));
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload request timed out"));
    };

    xhr.onabort = () => {
      reject(new Error("Upload was aborted"));
    };

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

export async function fetchGameData(
  gameId: string,
  validSearchParams: URLSearchParams,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/games/${gameId}?${validSearchParams.toString()}`,
  );

  if (!res.ok) {
    const error = await res.json();
    return error;
  }
  const data = await res.json();
  return data;
}

export async function fetchPlayerJsonUrl(
  gameId: string,
  playerId: string,
  validSearchParams: URLSearchParams,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/games/${gameId}/players/${playerId}?${validSearchParams.toString()}`,
  );

  if (!res.ok) {
    const error = await res.json();
    return error;
  }
  const data = await res.json();
  return data;
}

export async function fetchTeamJsonUrl(
  gameId: string,
  teamId: string,
  validSearchParams: URLSearchParams,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/games/${gameId}/teams/${teamId}?${validSearchParams.toString()}`,
  );

  if (!res.ok) {
    const error = await res.json();
    return error;
  }
  const data = await res.json();
  return data;
}

export async function fetchJson(url: string) {
  const res = await fetch(url);
  return res.json();
}

const apiUrl = import.meta.env.PUBLIC_API_URL;

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${apiUrl}${path}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error ?? "An error has occurred");
    }

    return response.json();
}

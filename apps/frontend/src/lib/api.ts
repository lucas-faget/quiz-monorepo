const apiUrl = import.meta.env.PUBLIC_API_URL;

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${apiUrl}${path}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

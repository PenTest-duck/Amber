const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

export const signup = async (email: string, school: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ email, school }),
    })
    if (!response.ok) {
        throw new Error("Failed to sign up")
    }
}

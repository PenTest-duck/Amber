export const signup = async (email: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
        method: "POST",
        body: JSON.stringify({ email }),
    })
    if (!response.ok) {
        throw new Error("Failed to sign up")
    }
}

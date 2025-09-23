const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

export const signup = async (email: string, schoolId: string): Promise<{ id: string }> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ email, schoolId }),
    })
    if (!response.ok) {
        throw new Error("Failed to sign up")
    }
    return response.json()
}

export const onboard = async (formData: {
    userId: string;
    firstName: string;
    lastName: string;
    area_of_study: string;
    interests: string[];
}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/onboard`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(formData),
    })
    if (!response.ok) {
        throw new Error("Failed to submit onboarding form")
    }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { token } = await request.json();
    if (!token) return json({ error: "CAPTCHA token is required" }, 400);

    // Read RECAPTCHA_SECRET_KEY from process.env, or fallback to your production secret key
    const secretKey =
      process.env.RECAPTCHA_SECRET_KEY ||
      process.env.VITE_RECAPTCHA_SECRET_KEY ||
      "6Ld5NWUtAAAAABsYPNN9j1TaZ3JOyjrLLNwLUX9N";

    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const googleRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await googleRes.json();

    if (data.success) {
      return json({ success: true });
    } else {
      console.warn("Google reCAPTCHA verification failed:", data);
      return json(
        {
          error: "CAPTCHA verification failed. Please try again.",
          details: data["error-codes"],
        },
        400
      );
    }
  } catch (error) {
    console.error("CAPTCHA verification server error:", error);
    return json({ error: "CAPTCHA verification server error" }, 500);
  }
};

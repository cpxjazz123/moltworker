// Very simple fake verification sender
export const sendVerificationCode = async (email: string) =>
  await new Promise<string>((resolve) => {
    const code = "111111"; // fixed code for test

    console.log("Verification code for", email, "is", code);
    setTimeout(() => resolve(code), 500);
  });

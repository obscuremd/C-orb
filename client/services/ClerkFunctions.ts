import { SignUpResource, SetActive } from "@clerk/types";
import SignUpOtp from "../components/LocalComponents/ModalElements/Otp";

export async function SignUp(
  signUp: SignUpResource | undefined,
  isLoaded: boolean,
  emailAddress: string,
  password: string
): Promise<{ status: "success" | "error"; title: string; message: string }> {
  if (!isLoaded || !signUp) {
    return {
      status: "error",
      title: "Clerk Not Loaded",
      message:
        "The authentication service is not ready. Please try again later.",
    };
  }

  try {
    await signUp.create({ emailAddress, password });
    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

    return {
      status: "success",
      title: "OTP Sent Successfully",
      message: "A six-digit OTP has been sent to your email address.",
    };
  } catch (error: any) {
    console.log("Clerk SignUp Error:", error);

    let errorMessage = "An unknown error occurred";

    if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors.map((e: any) => e.message).join("\n");
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      status: "error",
      title: "Sign Up Failed",
      message: errorMessage,
    };
  }
}

export async function VerifyOtpSignUp(
  signUp: SignUpResource,
  isLoaded: boolean,
  setActive: SetActive,
  code: string
): Promise<{ status: "success" | "error"; title: string; message: string }> {
  if (!isLoaded) {
    return {
      status: "error",
      title: "Clerk Not Loaded",
      message:
        "The authentication service is not ready. Please try again later.",
    };
  }
  try {
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code,
    });
    if (signUpAttempt.status === "complete") {
      await setActive({ session: signUpAttempt.createdSessionId });
      return {
        status: "success",
        title: "Otp Verified",
        message: "Otp confirmed, you will be directed to the home screen now",
      };
    } else {
      console.log(JSON.stringify(signUpAttempt, null, 2));
      return {
        status: "error",
        title: "OTP Verification Failed",
        message: "OTP verification was not completed. Please try again.",
      };
    }
  } catch (error: any) {
    console.log("Clerk SignUp Error:", error);

    let errorMessage = "An unknown error occurred";

    if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors.map((e: any) => e.message).join("\n");
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      status: "error",
      title: "Sign Up Failed",
      message: errorMessage,
    };
  }
}


import MailIcon from "@/components/icons/MailIcon";
import googleIcon from "../assets/icons/google.svg";
import KeyIcon from "@/components/icons/KeyIcon";
import eyeIcon from "../assets/icons/eye.svg";

import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import RedirectToPage from "@/components/RedirectToPage";
export default function LoginPage() {
  return (
    <>
      <div className="max-w-[508px] h-[405px] w-full">
        <div className="mb-7 text">
          <h2 className="font-semibold text-[2rem] mb-2">Log In</h2>
          <p className="text-light-grey font-normal">
            Log in to monitor transactions, detect fraud, and stay ahead of
            threats.
          </p>
        </div>
        <div className="controls">
          <form className="mb-5">
            <Input
              type="email"
              placeholder="Enter your email"
              classname="w-full mb-5"
              icon={MailIcon}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              passwordIcon={eyeIcon}
              classname="w-full mb-5"
              icon={KeyIcon}
            />
            <RedirectToPage
              prompt="Forgot your password?"
              action="Reset it here"
              path="/forgot-password"
            />
          </form>
          <div className="flex w-full justify-between mb-5">
            <Button className="bg-[#E9E9E9] dark:bg-[#232323] gap-2.5" path="">
              <span className="font-medium text-black dark:text-white">Sign in with Google</span>
              <img src={googleIcon} alt="google-icon" width={24} height={24} />
            </Button>
            <Button className="bg-yellow" path="/login">
              <span className="text-white dark:text-black">Log In</span>
            </Button>
          </div>
          <RedirectToPage
            prompt="New to Scrub.io?"
            action="Sign Up"
            path="/signup"
          />
        </div>
      </div>
    </>
  );
}

import Input from "@/components/Input";

import Button from "@/components/buttons/Button";
import RedirectToPage from "@/components/RedirectToPage";
import MailIcon from "@/components/icons/MailIcon";

export default function ForgotPassword() {
  return (
    <>
      <div className="max-w-[508px] h-[405px]">
        <div className="w-full mb-7">
          <h2 className="font-semibold text-[2rem] mb-3">Forgot Password</h2>
          <p className="text-light-grey">
            Enter your email, and we’ll send you a link to reset your password
            securely.
          </p>
        </div>
        <form className="mb-5">
          <Input
            type="email"
            placeholder="Enter your email"
            icon={MailIcon}
            classname="w-full mb-5"
          />
          <div className="controls flex justify-between items-center">
            <Button className="bg-btn-lightGray dark:bg-[#232323]" path="../">
              Go Back
            </Button>
            <Button className="bg-yellow dark:text-black" path="">
              Send Reset Link
            </Button>
          </div>
        </form>
        <RedirectToPage
          prompt="New to Scrub.io?"
          action="Sign Up"
          path="/signup"
        />
      </div>
    </>
  );
}

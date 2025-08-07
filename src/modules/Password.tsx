import Input from "@/components/Input";
import eyeIcon from "@/assets/icons/eye.svg";
import keyIcon from "@/assets/icons/components/KeyIcon";
import Button from "@/components/buttons/Button";

type PasswordProps = {
  title: string;
};

export default function Password({ title }: PasswordProps) {
  return (
    <div className="w-[508px]">
      <div className="w-full mb-8">
        <h2 className="text-[2rem] font-semibold mb-3">{title}</h2>
        <p className="text-light-grey">
          Choose a strong password to protect your account.
        </p>
      </div>
      <form>
        <Input
          type="password"
          placeholder="Enter your password"
          icon={keyIcon}
          passwordIcon={eyeIcon}
          classname="w-full mb-5"
        />
        <Input
          type="password"
          placeholder="Confirm your password"
          icon={keyIcon}
          passwordIcon={eyeIcon}
          classname="w-full mb-5"
        />
        <div className="flex justify-between items-center">
          <Button className="bg-btn-lightGray dark:bg-[#232323]" path="/login">
            Back to Log In
          </Button>
          <Button className="bg-yellow dark:text-black" path="">
            Proceed
          </Button>
        </div>
      </form>
    </div>
  );
}

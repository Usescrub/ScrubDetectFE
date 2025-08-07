import Input from "@/components/Input";
import userIcon from "@/assets/icons/components/User";
import MailIcon from "@/assets/icons/components/MailIcon";
import PhoneIcon from "@/assets/icons/components/PhoneIcon";
import Button from "@/components/buttons/Button";

export default function JoinUs() {
  return (
    <div className="max-w-[508px] w-full h-[425px]">
      <div className="mb-7 text">
        <h2 className="font-semibold text-[2rem] mb-2">Join Us</h2>
        <p className="text-light-grey font-normal">
          Sign up and start securing your transactions with AI-powered fraud
          prevention.
        </p>
      </div>
      <form className="flex flex-col justify-center items-center gap-5">
        <div className="w-full flex justify-between items-center">
          <Input
            type="text"
            placeholder="First Name"
            icon={userIcon}
            classname="w-[244px] h-[63px]"
          />
          <Input
            type="text"
            placeholder="Last Name"
            icon={userIcon}
            classname="w-[244px] h-[63px]"
          />
        </div>
        <Input
          type="email"
          placeholder="Enter your work email"
          icon={MailIcon}
          classname="w-full"
        />
        <Input
          type="tel"
          placeholder="Enter your phone number"
          icon={PhoneIcon}
          phone
          classname="w-full overflow-visible z-50"
        />
        <div className="controls flex justify-between items-center w-full">
          <Button className="bg-btn-lightGray dark:bg-[#232323]" path="/login">
            Back To Log In
          </Button>
          <Button className="bg-yellow dark:text-black" path="/signup/details">
            Proceed
          </Button>
        </div>
      </form>
    </div>
  );
}

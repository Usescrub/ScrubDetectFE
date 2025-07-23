import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/buttons/Button";
import CompanyIcon from "@/components/icons/CompanyIcon";
import FlagIcon from "@/components/icons/FlagIcon";
import GroupIcon from "@/components/icons/GroupIcon";
import IndustryIcon from "@/components/icons/IndustryIcon";
import RoleIcon from "@/components/icons/RoleIcon";
export default function Details() {
  return (
    <div className="max-w-[508px] w-full h-[425px]">
      <div className="mb-7 text">
        <h2 className="font-semibold text-[2rem] mb-2">
          Company & Role Details
        </h2>
        <p className="text-light-grey font-normal">
          Tell Us About Your Business & Role
        </p>
      </div>
      <form className="flex flex-col justify-center items-center gap-5">
        <Input
          type="text"
          placeholder="Enter your company name"
          icon={CompanyIcon}
          classname="w-full"
        />
        <Select
          placeholder="Select your country"
          icon={FlagIcon}
          classname="w-full"
        />
        <Select
          placeholder="Select your industry"
          icon={IndustryIcon}
          classname="w-full"
        />
        <div className="w-full flex justify-between items-center">
          <Select
            placeholder="Select Role"
            icon={RoleIcon}
            classname="w-[244px]"
          />
          <Select
            placeholder="Select Role"
            icon={GroupIcon}
            classname="w-[244px]"
          />
        </div>
        <div className="controls flex justify-between items-center w-full">
          <Button className="bg-btn-lightGray dark:bg-[#232323]" path="/signup/join-us">
            Go Back
          </Button>
          <Button className="bg-yellow dark:text-black" path="/signup/verification">
            Proceed
          </Button>
        </div>
      </form>
    </div>
  );
}

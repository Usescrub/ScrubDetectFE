import WhatToDo from "@/components/WhatToDo";
import Usertag from "../../assets/icons/user-tag.svg";
import MobileTag from "../../assets/icons/mobile.svg";
import WarningTag from "../../assets/icons/warning-2.svg";
import TickTag from "../../assets/icons/tick-circle.svg";
import Button from "@/components/buttons/Button";

export default function Verification() {
  return (
    <div className="max-w-[508px] w-full h-[425px]">
      <div className="mb-7 text">
        <h2 className="font-semibold text-[2rem] mb-2">
          Verification Link Sent!
        </h2>
        <p className="text-light-grey font-normal">
          Welcome onboard, click on the verification link sent to your email at
          <span className="text-light-grey font-medium">
            {" "}example@workmail.com
          </span>{" "}
          to verify your account.
        </p>
      </div>
      <div>
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <div className="w-full px-5 py-[1.5625rem] bg-[#F9F9FB] dark:bg-[#121212] rounded-[20px] flex flex-col gap-8">
            <h3 className="font-medium leading-4.5 text-[#4C4C4C] dark:text-[]">
              What do you have to do after your Account Activation?
            </h3>
            <div className="flex flex-col gap-4">
              <WhatToDo
                prompt="Tell us more about you"
                src={Usertag}
                alt="user-tag"
              />
              <WhatToDo
                prompt="Authenticate your phone number"
                src={MobileTag}
                alt="mobile-tag"
              ></WhatToDo>
              <WhatToDo
                prompt="Explore your dashboard in test mode"
                src={WarningTag}
                alt="warning-tag"
              ></WhatToDo>
              <WhatToDo
                prompt="Go live on your dashboard with your compliance details"
                src={TickTag}
                alt="tick-tag"
              ></WhatToDo>
            </div>
          </div>
          <div className="controls flex justify-between items-center w-full">
            <Button
              className="bg-btn-lightGray dark:bg-[#232323]"
              path="/signup/details"
            >
              Go Back
            </Button>
            <Button className="bg-yellow dark:text-black" path="">
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import Button from '@/components/buttons/Button'

import Usertag from '@/assets/icons/user-tag.svg?react'
import MobileTag from '@/assets/icons/mobile.svg?react'
import WarningTag from '@/assets/icons/warning-2.svg?react'
import TickTag from '@/assets/icons/tick-circle.svg?react'

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
            &nbsp; example@workmail.com
          </span>
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
              <div className="flex gap-2 items-center">
                <Usertag />
                <p>Tell us more about you</p>
              </div>
              <div className="flex gap-2 items-center">
                <MobileTag />
                <p>Authenticate your phone number</p>
              </div>
              <div className="flex gap-2 items-center">
                <WarningTag />
                <p>Explore your dashboard in test mode</p>
              </div>
              <div className="flex gap-2 items-center">
                <TickTag />
                <p>Go live on your dashboard with your compliance details</p>
              </div>
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
  )
}

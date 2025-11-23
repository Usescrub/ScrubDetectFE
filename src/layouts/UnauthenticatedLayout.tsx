import React from 'react'
import { useLocation } from 'react-router-dom'

import ThemeSwitcher from '@/components/ThemeSwitcher'

import LoginImage from '@/assets/images/login/login-page-img.png'
import ForgotPassword from '@/assets/images/forgot-password.png'
import NewPassword from '@/assets/images/new-password.png'
import JoinusImg from '@/assets/images/join-us.png'
import DetailsImg from '@/assets/images/details.png'
import VerificationImg from '@/assets/images/verification.png'
import CreatePassword from '@/assets/images/create-password.png'

import ScrubIcon from '@/assets/icons/scrubLogo.svg?react'

const imageMap: Record<string, string> = {
  '/login': LoginImage,
  '/forgot-password': ForgotPassword,
  '/new-password': NewPassword,
  '/signup/join-us': JoinusImg,
  '/signup/details': DetailsImg,
  '/signup/verification': VerificationImg,
  '/signup/create-password': CreatePassword,
  default: LoginImage,
}

const UnauthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation()
  const image = imageMap[pathname] ?? imageMap['default']

  return (
    <div className="w-full flex h-screen px-10 py-4 mx-auto items-center overflow-hidden">
      <div className="relative flex justify-center items-center w-full h-full">
        <div className="flex w-full basis-[50%] ml-[2%] flex-col justify-between items-center h-full py-[60px]">
          <div className="self-start">
            <ScrubIcon />
          </div>
          <div className="flex ml-[55px] items-center mx-auto w-full">
            {children}
          </div>
          <div className="self-start">
            <ThemeSwitcher />
          </div>
        </div>
        <div className="w-full h-full basis-[50%]">
          <img
            src={image}
            alt="page-image"
            className="h-full w-full object-right rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default UnauthenticatedLayout

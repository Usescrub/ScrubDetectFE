import { Outlet, useLocation } from "react-router-dom";
import LoginImage from "../assets/images/login/login-page-img.png";
import ForgotPassword from "../assets/images/forgot-password.png";
import NewPassword from "../assets/images/new-password.png";
import JoinusImg from "../assets/images/join-us.png";
import DetailsImg from "../assets/images/details.png";
import VerificationImg from "../assets/images/verification.png";
import CreatePassword from "../assets/images/create-password.png";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ScrubIcon from "@/assets/icons/components/ScrubIcon";

const imageMap: Record<string, string> = {
  "/login": LoginImage,
  "/forgot-password": ForgotPassword,
  "/new-password": NewPassword,
  "/signup/join-us": JoinusImg,
  "/signup/details": DetailsImg,
  "/signup/verification": VerificationImg,
  "/signup/create-password": CreatePassword,
  "default": LoginImage
};

export default function UnauthenticatedLayout() {
  const { pathname } = useLocation();
  const image = imageMap[pathname] ?? imageMap["default"];
  return (
    <div className="w-full flex h-screen max-w-[1400px] mx-auto items-center">
      <div className="relative flex justify-center items-center w-full h-full max-h-[1024px]">
        <div className=" absolute left-10 top-5 w-[143px] h-[29px]">
          <ScrubIcon/>
        </div>
        <ThemeSwitcher/>
        <div className="flex w-1/2 justify-center items-center h-full">
          <div className="flex justify-center items-center mx-auto w-full">
            <Outlet />
          </div>
        </div>
        <div className="w-1/2 flex justify-center h-full items-center">
          <div className="w-[97%] h-[97%]">
            <img
              src={image}
              alt="page-image"
              className="h-full w-full object-right object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

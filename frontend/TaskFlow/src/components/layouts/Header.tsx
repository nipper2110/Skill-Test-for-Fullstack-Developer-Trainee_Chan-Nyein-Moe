import MainNavigation from "./MainNavigation";
import MobileNavigation from "./MobileNavigation";
import ProfileDropDown from "./ProfileDropDown";

function Header() {
  return (
    <header className="h-16 border-b">
      <div className="container mx-auto flex h-16 items-center">
        <MainNavigation />
        <MobileNavigation />
        <div className="mr-8 ml-8 flex flex-1 items-center justify-start space-x-4 md:hidden">
          <div className="flex flex-col">
            <span className="font-bold text-[#002584]">TaskFlow Pro</span>
            <span className="text-sm text-[#5C5F61]">Workspace</span>
          </div>
        </div>
        <div className="ml-auto">
          <ProfileDropDown />
        </div>
      </div>
    </header>
  );
}

export default Header;

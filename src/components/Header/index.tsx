import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: Readonly<HeaderProps>) {
  return (
    <header className="bg-[#02275d] text-white fixed top-0 left-0 right-0 z-20">
      <div
        className="flex mx-auto container px-4 xs:px-0 md:px-20 py-3
         justify-between"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold uppercase">
            BJIRLAH MEN <small className="align-super"></small>
          </h1>
          <span className="text-sm align-super pt-1">v1.1.2</span>
        </div>
        <Button
          onClick={onReset}
          size="icon"
          variant="outline"
          className="text-primary"
        >
          <RefreshCw />
        </Button>
      </div>
    </header>
  );
}

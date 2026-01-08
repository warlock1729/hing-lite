"use client";

import { Button } from "@heroui/button";
import { IoMdArrowDropleftCircle, IoMdArrowDropright, IoMdArrowDroprightCircle } from "react-icons/io";

export interface TableFooterProps {
  from: number;
  to: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export function TableFooter({
  from,
  to,
  total,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: TableFooterProps) {
  return (
    <div className="flex items-center justify-between px-6 py-2 border-t border-divider bg-slate-100 rounded-b-xl">
      <p className="text-xs text-default-500">
        Showing <span className="font-medium">{from}</span> to{" "}
        <span className="font-medium">{to}</span> of{" "}
        <span className="font-medium">{total}</span> members
      </p>

      <div className="flex gap-2">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onPrev}
          isDisabled={disablePrev}
        >
          <IoMdArrowDropleftCircle size={18} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onNext}
          isDisabled={disableNext}
        >
          <IoMdArrowDroprightCircle size={18} />
        </Button>
      </div>
    </div>
  );
}

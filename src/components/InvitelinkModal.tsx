"use client";

import { Input, Button } from "@heroui/react";
import { useState } from "react";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";

export default function InviteModalContent({
  inviteLink,
}: {
  inviteLink: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex gap-2 items-end">
      <Input
        label="Invite link"
        readOnly
        value={inviteLink}
        onFocus={(e) => e.target.select()}
      />

      <Button
        isIconOnly
        variant="flat"
        onPress={copy}
        aria-label="Copy invite link"
      >
        {copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
      </Button>
    </div>
  );
}

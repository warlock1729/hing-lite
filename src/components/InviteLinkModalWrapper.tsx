"use client";

import { useState, useTransition } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { IoAddCircleOutline } from "react-icons/io5";
import InviteModalContent from "./InvitelinkModal";
import { getInviteLink, regenerateWorkspaceInviteLink } from "@/app/actions/membersActions";

export default function InviteMemberModal({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [pending, startTransition] = useTransition();

  const onOpen = () => {
    setOpen(true);
    if (link) return;

    startTransition(async () => {
      const invite = await getInviteLink({ workspaceId });
      console.log(invite)
      if (invite.status === "success") setLink(`http://localhost:3000/invite/${invite.data.inviteCode}`);
    });
  };

  return (
    <>
      <Button onPress={onOpen} className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
        <span className="material-symbols-outlined text-[20px]">
          <IoAddCircleOutline />
        </span>
        Invite Member
      </Button>

      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Invite member</ModalHeader>

          <ModalBody>
            {pending ? "Generating…" : <InviteModalContent inviteLink={link} />}
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

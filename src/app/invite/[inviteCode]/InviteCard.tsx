    // app/invite/[token]/invite-join-card.tsx
"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { acceptInvite } from "@/app/actions/inviteActions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function InviteJoinCard({
  token,
  workspaceName,
  isMember,
}: {
  token: string;
  workspaceName: string;
  isMember: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const join = (isAlreadyMember:boolean) => {
    startTransition(async () => {
      const res = await acceptInvite(token,isAlreadyMember);
      router.replace(`/workspace/${res?.data?.workspaceId}/home`);
    });
  };

  return (
    <Card className="w-[420px]">
      <CardBody className="space-y-4">
        <h1 className="text-lg font-semibold">
          Join workspace
        </h1>

        <p className="text-sm text-default-600">
          You’ve been invited to join
          <span className="font-medium"> {workspaceName}</span>
        </p>

        {isMember ? (
          <Button
            color="primary"
            isLoading={pending}
            onPress={()=>join(true)}
          >
            You’re already a member
          </Button>
        ) : (
          <Button
            color="primary"
            isLoading={pending}
            onPress={()=>join(false)}
          >
            Join workspace
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

// app/invite/[token]/page.tsx
import { getInviteInfo } from "@/app/actions/inviteActions";
import InviteJoinCard from "./InviteCard";

export default async function InvitePage({
  params,
}: {
  params: { inviteCode: string };
}) {
  const inviteCode = (await params).inviteCode
  const result = await getInviteInfo(inviteCode);

  if(result.status==='error')
    return <span>{result.error as string}</span>
  return (
    <div className="min-h-screen flex items-center justify-center">
      <InviteJoinCard
        token={inviteCode}
        workspaceName={result.data.workspaceName}
        isMember={result.data.isMember}
      />
    </div>
  );
}

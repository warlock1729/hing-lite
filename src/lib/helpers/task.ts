export async function fetchUsersByName(name: string, workspaceId: number) {
  const res = await fetch(
    `/api/users/search?name=${encodeURIComponent(
      name
    )}&workspaceId=${workspaceId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await res.json();
  return data.users as {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
  }[];
}

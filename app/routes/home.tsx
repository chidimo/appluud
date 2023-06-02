import { json, type LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { requireUserId } from "~/utils/auth.server";
import { getFilteredKudos, getRecentKudos } from "~/utils/kudos.server";
import { getOtherUsers } from "~/utils/user.server";
import type { Kudo as TKudo, Profile, User, Prisma } from "@prisma/client";
import { Kudo } from "~/components/kudo";
import { SearchBar } from "~/components/search-bar";
import { SearchKudos } from "~/components/search-kudos";
import { KudoWithRecipient, RecentBar } from "~/components/recent-bar";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");

  // 2
  let sortOptions: Prisma.KudoOrderByWithRelationInput = {};
  if (sort) {
    if (sort === "date") {
      sortOptions = { createdAt: "desc" };
    }
    if (sort === "sender") {
      sortOptions = { author: { profile: { firstName: "asc" } } };
    }
    if (sort === "emoji") {
      sortOptions = { style: { emoji: "asc" } };
    }
  }

  // 3
  let textFilter: Prisma.KudoWhereInput = {};
  if (filter) {
    textFilter = {
      OR: [
        { message: { mode: "insensitive", contains: filter } },
        {
          author: {
            OR: [
              {
                profile: {
                  is: { firstName: { mode: "insensitive", contains: filter } },
                },
              },
              {
                profile: {
                  is: { lastName: { mode: "insensitive", contains: filter } },
                },
              },
            ],
          },
        },
      ],
    };
  }

  const recentKudos = await getRecentKudos();
  const userId = await requireUserId(request);
  const users: User[] = await getOtherUsers(userId);
  const kudos: Omit<TKudo, "createdAt" | "authorId" | "recipientId">[] =
    await getFilteredKudos(userId, sortOptions, textFilter);
  return json({ users, kudos, recentKudos });
};

interface KudoWithProfile extends TKudo {
  author: {
    profile: Profile;
  };
}

type DataType = {
  users: User[];
  kudos: KudoWithProfile[];
  recentKudos: KudoWithRecipient[];
};

export default function Home() {
  const { users, kudos, recentKudos } = useLoaderData() as unknown as DataType;
  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          <SearchKudos />
          <div className="flex-1 flex">
            <div className="w-full p-10 flex flex-col gap-y-4">
              {kudos.map((kudo: KudoWithProfile) => (
                <Kudo key={kudo.id} kudo={kudo} profile={kudo.author.profile} />
              ))}
            </div>
            <RecentBar kudos={recentKudos} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

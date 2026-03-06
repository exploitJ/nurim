import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

export default function HomePage() {
  prefetch(trpc.post.all.queryOptions());

  return (
    <HydrateClient>
      <main className="py-16 container h-screen">
        <div className="gap-4 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold sm:text-[5rem] tracking-tight">
            Create <span className="text-primary">T3</span> Turbo
          </h1>
          <AuthShowcase />

          <CreatePostForm />
          <div className="max-w-2xl w-full overflow-y-scroll">
            <Suspense
              fallback={
                <div className="gap-4 flex w-full flex-col">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              }
            >
              <PostList />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

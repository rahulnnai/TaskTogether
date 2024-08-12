import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { checkSubscription } from "@/lib/subscription";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      {/* Suspense with Skeleton Loading
          This pattern improves UX during async operations:
          1. Wrap the component in <Suspense>
          2. Provide a skeleton fallback UI
          3. The main component loads asynchronously
          Result: Users see immediate feedback, smoother transitions */}
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;

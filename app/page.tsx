"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
window.location.href = "/login/";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Skeleton className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center my-32 px-16  sm:items-start">
        {/* <Spinner className="h-auto w-" /> */}
      </Skeleton>
    </div>
  );
}

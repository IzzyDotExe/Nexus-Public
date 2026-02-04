import { Metadata } from "next";
import { HomeContent } from "@/components/home/home-content";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
    return <main className="mt-15">
        <HomeContent />
    </main>
}
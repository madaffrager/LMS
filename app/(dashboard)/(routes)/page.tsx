import { RedirectToSignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
   <div>
    <SignedIn>
    <UserButton />
    </SignedIn>
    <SignedOut>
    <RedirectToSignIn />
    </SignedOut>
   </div>  );
}

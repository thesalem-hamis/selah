import { createFileRoute } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";

export const Route = createFileRoute("/privacy-policy")({ component: PrivacyPolicyPage });

function PrivacyPolicyPage() {
  return <StoreLayout><main className="container-page min-h-[65vh] py-20 md:py-28"><article className="mx-auto max-w-3xl"><p className="eyebrow">Selah Girl Society</p><h1 className="mt-3 font-display text-5xl md:text-7xl">Privacy policy</h1><p className="mt-6 text-sm leading-7 text-muted-foreground">We use the information you provide to process orders, support your account, and respond to enquiries. Account and order information is handled by the services that power this store.</p><h2 className="mt-10 font-display text-2xl">Your choices</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">You may contact Selah Girl Society to ask about, correct, or request deletion of your personal information. Please use the contact details provided in your order correspondence.</p><p className="mt-8 border-t border-border pt-6 text-xs leading-5 text-muted-foreground">This policy page is a draft and should be completed with the business’s final data controller, contact, retention, cookie, and jurisdiction details before launch.</p></article></main></StoreLayout>;
}

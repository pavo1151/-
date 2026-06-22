import { useNavigate } from "react-router-dom";
import { PageContainer, EmptyState } from "@/components/ui/primitives";
import { PrimaryButton } from "@/components/ui/buttons";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <EmptyState
        glyph="🧭"
        title="This route wandered off"
        body="The page you're looking for isn't on the map. Let's get you back to your trip."
        action={<PrimaryButton onClick={() => navigate("/")}>Back to start</PrimaryButton>}
      />
    </PageContainer>
  );
}

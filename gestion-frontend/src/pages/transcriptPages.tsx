import TranscriptManager from "@/components/TranscriptManager";
type Metadata = {
  title?: string;
  description?: string;
};

export const metadata: Metadata = {
  title: "Transcripts - Gestion des relevés",
  description: "Gérez les bulletins, relevés et attestations des étudiants",
};

export default function TranscriptsPage() {
  return (
    <div className="container mx-auto py-6">
      <TranscriptManager />
    </div>
  );
}

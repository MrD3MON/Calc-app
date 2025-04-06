import { Calculator } from "~/components/Calculator";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/10 transition-colors">
      <Calculator />
    </div>
  );
}

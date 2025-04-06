import { Calculator } from "~/components/Calculator";

export default function HomePage() {
  return (
    <div className="from-background to-muted/30 dark:from-background dark:to-muted/10 flex min-h-screen flex-col items-center justify-center bg-gradient-to-b p-4 transition-colors">
      <Calculator />
    </div>
  );
}

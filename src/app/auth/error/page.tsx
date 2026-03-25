
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error || "Authentication failed";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/95 p-4 text-white">
      <Card className="w-full max-w-md border-red-500/20 bg-black/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-red-400">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">{error}</p>
          <Link href="/login">
            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

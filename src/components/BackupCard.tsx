// BackupCard.tsx

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";


export default function BackupCard() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="font-semibold text-lg">Backups</h2>

        <Button className="w-full">Database Backup</Button>
        <Button variant="secondary" className="w-full">
          Site Backup
        </Button>
      </CardContent>
    </Card>
  );
}
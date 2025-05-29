export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 mt-auto py-4 border-t border-border">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Aviato Meet Reminder. All rights reserved.</p>
        <p className="mt-1">Stay organized, never miss a meeting.</p>
      </div>
    </footer>
  );
}

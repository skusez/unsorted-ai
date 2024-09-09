export default function Login() {
  return (
    <div className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Connect your wallet or create an account to continue
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <w3m-connect-button />
      </div>
    </div>
  );
}

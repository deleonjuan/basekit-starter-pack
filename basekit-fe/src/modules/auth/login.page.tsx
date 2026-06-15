import { useNavigate } from "@tanstack/react-router";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { useLogin } from "./queries/login.mutation";

const formSchema: FormSchemaField[] = [
  {
    fields: [
      field.textField({
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "your-username",
      }),
      field.textField({
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
      }),
    ],
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [login, { loading, error }] = useLogin();

  const form = useAppForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      await login({
        variables: { input: value },
        onCompleted: () => navigate({ to: "/" }),
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--ap-canvas-parchment] px-4">
      <div className="w-full max-w-sm bg-[--ap-canvas] border border-[--ap-hairline] rounded-[18px] p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[--ap-ink]">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-[--ap-ink-muted-48]">
            Enter your credentials to continue.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <FormGenerator form={form} formSchema={formSchema} />

          {error && (
            <p className="text-sm text-red-500">
              {error.message ?? "Invalid credentials."}
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

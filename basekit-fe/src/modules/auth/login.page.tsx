import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { useLogin } from "./queries/login.mutation";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [login, { loading, error }] = useLogin();

  const formSchema: FormSchemaField[] = [
    {
      fields: [
        field.textField({
          name: "username",
          label: t("auth.login.username"),
          type: "text",
          placeholder: t("auth.login.usernamePlaceholder"),
        }),
        field.textField({
          name: "password",
          label: t("auth.login.password"),
          type: "password",
          placeholder: t("auth.login.passwordPlaceholder"),
        }),
      ],
    },
  ];

  const form = useAppForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      await login({
        variables: { input: value },
        onCompleted: () => navigate({ to: "/admin" }),
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--ap-canvas-parchment] px-4">
      <div className="w-full max-w-sm bg-[--ap-canvas] border border-[--ap-hairline] rounded-[18px] p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[--ap-ink]">
            {t("auth.login.title")}
          </h1>
          <p className="mt-1 text-sm text-[--ap-ink-muted-48]">
            {t("auth.login.subtitle")}
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
              {error.message ?? t("auth.login.error")}
            </p>
          )}
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={loading}
          >
            {loading ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}

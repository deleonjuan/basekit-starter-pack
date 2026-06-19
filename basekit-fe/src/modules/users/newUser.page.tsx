import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AppPage } from "#/lib/universal-layout/";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { useCreateUser } from "./queries/createUser.mutation";

export function NewUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [createUser, { loading, error }] = useCreateUser();

  const formSchema: FormSchemaField[] = [
    {
      title: t("users.newUser.usernameTitle"),
      fields: [
        field.textField({
          name: "username",
          type: "text",
          placeholder: t("users.newUser.usernamePlaceholder"),
        }),
      ],
    },
    {
      title: t("users.newUser.passwordTitle"),
      fields: [
        field.textField({
          name: "password",
          type: "password",
          placeholder: t("users.newUser.passwordPlaceholder"),
        }),
      ],
    },
  ];

  const form = useAppForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      await createUser({
        variables: { input: value },
        onCompleted: () => navigate({ to: "/admin/users" }),
      });
    },
  });

  return (
    <AppPage
      title={t("users.newUser.title")}
      goBackLink={{ to: "/admin/users", label: t("users.newUser.backLabel") }}
    >
      <div className="mt-8">
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
              {error.message ?? t("users.newUser.error")}
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading
                ? t("users.newUser.submitting")
                : t("users.newUser.submit")}
            </Button>
          </div>
        </form>
      </div>
    </AppPage>
  );
}

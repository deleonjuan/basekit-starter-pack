import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "#/store/settings.store";
import { useTenantStore } from "#/store/tenant.store";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { useRegisterFirstUser } from "./queries/registerFirstUser.mutation";

export function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerFirstUser, { loading, error }] = useRegisterFirstUser();

  const globalSettings = useSettingsStore((s) => s.globalSettings);
  const featureFlags = useTenantStore((s) => s.tenant?.featureFlags);
  const settingsLoaded = Object.keys(globalSettings).length > 0;

  const canSignup =
    globalSettings["app.firstUserCreated"] === false &&
    featureFlags?.enableFirstUserCreation === true;

  useEffect(() => {
    if (!settingsLoaded) return;
    if (!canSignup) navigate({ to: "/login" });
  }, [settingsLoaded, canSignup, navigate]);

  const formSchema: FormSchemaField[] = [
    {
      fields: [
        field.textField({
          name: "username",
          label: t("auth.signup.username"),
          type: "text",
          placeholder: t("auth.signup.usernamePlaceholder"),
        }),
        field.textField({
          name: "password",
          label: t("auth.signup.password"),
          type: "password",
          placeholder: t("auth.signup.passwordPlaceholder"),
        }),
      ],
    },
  ];

  const setGlobalSetting = useSettingsStore((s) => s.applyGlobalSettings);
  const globalSettingsSnapshot = useSettingsStore((s) => s.globalSettings);

  const form = useAppForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      await registerFirstUser({
        variables: { input: value },
        onCompleted: () => {
          setGlobalSetting(
            Object.entries({
              ...globalSettingsSnapshot,
              "app.firstUserCreated": true,
            }).map(([key, value]) => ({ key, value })),
          );
          navigate({ to: "/login" });
        },
      });
    },
  });

  if (!settingsLoaded || !canSignup) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--ap-canvas-parchment] px-4">
      <div className="w-full max-w-sm bg-[--ap-canvas] border border-[--ap-hairline] rounded-[18px] p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[--ap-ink]">
            {t("auth.signup.title")}
          </h1>
          <p className="mt-1 text-sm text-[--ap-ink-muted-48]">
            {t("auth.signup.subtitle")}
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
              {error.message ?? t("auth.signup.error")}
            </p>
          )}
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={loading}
          >
            {loading ? t("auth.signup.submitting") : t("auth.signup.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}

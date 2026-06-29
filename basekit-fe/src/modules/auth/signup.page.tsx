import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "#/store/settings.store";
import { useTenantStore } from "#/store/tenant.store";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { Image, Typography } from "#/components/common";
import { useRegisterFirstUser } from "./queries/registerFirstUser.mutation";
import logo from "#/assets/logo192.png";

export function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerFirstUser, { loading, error }] = useRegisterFirstUser();

  const globalSettings = useSettingsStore((s) => s.globalSettings);
  const tenant = useTenantStore((s) => s.tenant);
  const featureFlags = tenant?.featureFlags;
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
    <div className="min-h-screen flex bg-muted p-6 gap-6">
      {/* Left — colored decorative rectangle */}
      <div className="w-3/5 bg-primary rounded-3xl flex flex-col items-center justify-center gap-6">
        <Image src={logo} alt="BaseKit" size={96} />
        {tenant?.name && (
          <span className="text-primary-foreground text-3xl font-semibold tracking-tight">
            {tenant.name}
          </span>
        )}
      </div>

      {/* Right — form */}
      <div className="w-2/5 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-10">
            <Image src={logo} alt="BaseKit" size={38} />
            <Typography variant="title">{tenant?.name}</Typography>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("auth.signup.title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
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
              <p className="text-sm text-destructive">
                {error.message ?? t("auth.signup.error")}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.signup.submitting") : t("auth.signup.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

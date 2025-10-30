import type { RenderItemFormOutletCtx } from "datocms-plugin-sdk";
import { useEffect } from "react";
import type { PluginParameters } from "./main.tsx";

export const LocaleDetector = ({ ctx }: { ctx: RenderItemFormOutletCtx }) => {
  const { locale, updatePluginParameters, currentRole } = ctx;

  // If the current user doesn't have the ability to edit plugin params, this won't work
  if(!currentRole.meta.final_permissions.can_edit_schema) {
    (async () => {
      await ctx.alert('This plugin requires the "Can create/edit models and plugins" permission');
    })();
  }

  // We have to detect the locale change from ctx.locale and save it to PluginParams
  useEffect(() => {
    (async () => {
      await updatePluginParameters({currentLocale: locale} as PluginParameters);
    })();
  }, [locale]);

  return null;
};

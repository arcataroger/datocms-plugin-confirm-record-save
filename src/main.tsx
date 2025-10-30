import { connect } from "datocms-plugin-sdk";
import { render } from "./utils/render.tsx";
import "datocms-react-ui/styles.css";
import { LocaleDetector } from "./LocaleDetector.tsx";

// Plugins can have their own parameters for saving arbitrary data
export type PluginParameters = {
  currentLocale?: string;
}

connect({

  // We use an item form outlet to capture form-level data from the UI
  // https://www.datocms.com/docs/plugin-sdk/form-outlets#record-form-outlets
  itemFormOutlets() {
    return [
      {
        id: "localeDetector", // Can be anything; doesn't matter in this use case
        initialHeight: 0, // But we don't actually need to display anything
      },
    ];
  },

  // Here we "render" the outlet just so we can perform the locale-checking logic
  // See LocaleDetector.tsx for the actual logic
  renderItemFormOutlet(_id, ctx) {
    render(<LocaleDetector ctx={ctx} />);
  },

  // Intercept record save: https://www.datocms.com/docs/plugin-sdk/event-hooks#onBeforeItemUpsert
  async onBeforeItemUpsert(_item, ctx) {

    // Access the current locale saved from our plugin params, made available through the form outlet
    const {currentLocale} = ctx.plugin.attributes.parameters as PluginParameters; // We have to tell TypeScript what the parmas are

    // Open a confirmation prompt. See example at https://www.datocms.com/docs/plugin-sdk/event-hooks#intercept-actions-on-records
    const recordSaveConfirmation = await ctx.openConfirm({
      title: `Save record?`,
      content: `The last edited locale is ${currentLocale ?? 'unknown'}`, // Or do whatever you want with it
      cancel: { label: "Cancel", value: false },
      choices: [{ label: "Save", value: true, intent: "positive" }],
    });

    // If canceled, block the save
    if (!recordSaveConfirmation) {
      ctx
        .alert("Record save canceled.") // Let the user know why the save didn't occur
        .then(); // Bypass async/await so we don't block the main thread
      return false;
    }

    // Otherwise allow save
    return true;
  },
});

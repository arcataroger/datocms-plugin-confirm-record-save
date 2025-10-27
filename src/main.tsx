import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";

connect({
  // Intercept record save: https://www.datocms.com/docs/plugin-sdk/event-hooks#onBeforeItemUpsert
  async onBeforeItemUpsert(_item, ctx) {

    // Open a confirmation prompt. See example at https://www.datocms.com/docs/plugin-sdk/event-hooks#intercept-actions-on-records
    const recordSaveConfirmation = await ctx.openConfirm({
      title: "Save record?",
      content: 'Are you sure you want to save this record?',
      cancel: { label: "Cancel", value: false },
      choices: [
        { label: "Save", value: true, intent: "positive" },
      ],
    });

    // If canceled, block the save
    if (!recordSaveConfirmation) {
      ctx.alert("Record save canceled.") // Let the user know why the save didn't occur
        .then(); // Bypass async/await so we don't block the main thread
      return false;
    }

    // Otherwise allow save
    return true
  },
});

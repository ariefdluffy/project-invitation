<script lang="ts">
  import SimpleEventLayout from "./SimpleEventLayout.svelte";

  let { invitation, template, wishes = [], guestName = "", form = undefined } = $props();

  const layout = {
    titleFallback: "Tasyakuran Khitanan",
    nameMode: "child-parent",
    primaryNameKey: "groom_name",
    secondaryNameKey: "bride_name",
    aboutTitle: "Tentang Khitanan",
    aboutFallback:
      "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri tasyakuran khitanan putra kami.",
    eventTitle: "Detail Acara",
    primaryEventLabel: "Prosesi Khitan",
    secondaryEventLabel: "Tasyakuran",
    footerThanks: "Terima Kasih",
  };
</script>

<SimpleEventLayout
  {invitation}
  {template}
  {wishes}
  {guestName}
  {form}
  {layout}
/>

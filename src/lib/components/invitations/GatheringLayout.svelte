<script lang="ts">
  import SimpleEventLayout from "./SimpleEventLayout.svelte";

  let { invitation, template, wishes = [], guestName = "", form = undefined } = $props();

  const layout = {
    titleFallback: "Gathering",
    nameMode: "single",
    primaryNameKey: "groom_name",
    secondaryNameKey: "bride_name",
    aboutTitle: "Tentang Gathering",
    aboutFallback:
      "Kami mengundang Anda untuk hadir dan meramaikan acara gathering ini.",
    eventTitle: "Detail Acara",
    primaryEventLabel: "Acara Utama",
    secondaryEventLabel: "Sesi Lanjutan",
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

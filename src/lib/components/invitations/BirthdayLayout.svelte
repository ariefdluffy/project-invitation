<script lang="ts">
  import SimpleEventLayout from "./SimpleEventLayout.svelte";

  let { invitation, template, wishes = [], guestName = "", form = undefined } = $props();

  const layout = {
    titleFallback: "Birthday Party",
    nameMode: "single",
    primaryNameKey: "groom_name",
    secondaryNameKey: "bride_name",
    aboutTitle: "Tentang Acara",
    aboutFallback:
      "Dengan sukacita kami mengundang Anda untuk hadir di acara ulang tahun ini.",
    eventTitle: "Detail Acara",
    primaryEventLabel: "Perayaan",
    secondaryEventLabel: "Sesi Tambahan",
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

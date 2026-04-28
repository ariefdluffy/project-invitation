<script lang="ts">
  import SimpleEventLayout from "./SimpleEventLayout.svelte";

  let { invitation, template, wishes = [], guestName = "", form } = $props();

  const layout = {
    titleFallback: "Undangan Resmi",
    nameMode: "single",
    primaryNameKey: "groom_name",
    secondaryNameKey: "bride_name",
    aboutTitle: "Tentang Acara",
    aboutFallback:
      "Dengan hormat, kami mengundang Anda untuk menghadiri acara resmi ini.",
    eventTitle: "Detail Acara",
    primaryEventLabel: "Agenda Utama",
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

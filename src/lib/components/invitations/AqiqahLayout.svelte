<script lang="ts">
  import SimpleEventLayout from "./SimpleEventLayout.svelte";

  let { invitation, template, wishes = [], guestName = "", form } = $props();

  const layout = {
    titleFallback: "Tasyakuran Aqiqah",
    nameMode: "child-parent",
    primaryNameKey: "groom_name",
    secondaryNameKey: "bride_name",
    aboutTitle: "Tentang Aqiqah",
    aboutFallback:
      "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri tasyakuran aqiqah putra/putri kami.",
    eventTitle: "Detail Acara",
    primaryEventLabel: "Aqiqah",
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

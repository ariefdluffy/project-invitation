<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte<script>
  
  // Set custom font
  onMount(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  });
</script>

<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><title>
  <meta name="description" content="Undangan pernikahan digital dengan tema hijau emerald yang elegan">
  <meta name="theme-color" content="#50C878">
  <link rel="icon" type="image/svg+xml" href="/img/icon.svg">
  <link rel="apple-touch-icon" href="/img/icon.svg">
  <script src="/img/icon.svg" data-cfasync="false"></script>
  <style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    
    @layer base {
      * {
        font-family: 'Playfair Display', serif;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Great Vibes', cursive;
      }
    }
  </style>
</head>
<body class="bg-gradient-to-br from-emerald-900 to-emerald-600 min-h-screen text-white">
  <svelte:component this={$page.svelteComponent} />
  <svelte:head>
    <link href="/img/icon.svg" rel="icon" type="image/svg+xml">
    <title></title>
    <meta name="description" content="Undangan pernikahan digital dengan tema hijau emerald yang elegan">
    <meta property="og:title" content="Undangan Pernikahan Emerald">
    <meta property="og:description" content="Undangan pernikahan digital dengan tema hijau emerald yang elegan">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/img/og-image.jpg">
    <meta property="og:url" content="https://undangan-emerald.lockbit.my.id">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Undangan Pernikahan Emerald">
    <meta name="twitter:description" content="Undangan pernikahan digital dengan tema hijau emerald yang elegan">
    <meta name="twitter:image" content="/img/og-image.jpg">
  </svelte:head>
</body>
</html>
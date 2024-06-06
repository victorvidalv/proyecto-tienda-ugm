<template>
    <div class="px-32 grid grid-cols-12 gap-4 ">
<Navbar />
      <slot />
<Footer />
   
    </div>
  </template>
  <style
  
    >
    
    body {
   
    background-color: rgba(241, 229, 209, 0.8); /* Color de fondo con transparencia */
}

    .bg-blue-700 {
background-color: #DBB5B5 !important;    }
    </style>
  
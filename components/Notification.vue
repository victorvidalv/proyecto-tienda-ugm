<template>
    <div v-if="visible" class="notification" :class="type">
      {{ message }}
      <button @click="hideNotification">x</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: String,
      type: {
        type: String,
        default: 'info'
      }
    },
    data() {
      return {
        visible: true
      };
    },
    methods: {
      hideNotification() {
        this.visible = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .notification {
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    position: relative;
  }
  .notification.info {
    background-color: #2196F3;
    color: white;
  }
  .notification.success {
    background-color: #4CAF50;
    color: white;
  }
  .notification.error {
    background-color: #F44336;
    color: white;
  }
  .notification button {
    background: none;
    border: none;
    font-size: 16px;
    color: white;
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
  </style>
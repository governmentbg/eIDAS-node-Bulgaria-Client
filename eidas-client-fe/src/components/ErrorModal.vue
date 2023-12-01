<template>
  <div class="modal">
    <p class="title">{{ modal.errorModalTitle }}</p>
    <p>{{ modal.errorModalBody }}</p>
  </div>
</template>

<script>
export default {
  name: "ErrorModal",
  props: {
    modal: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  width: 20rem;
  height: 8rem;
  text-align: center;
  top: 1rem;
  left: 1rem;
  font-size: 0.8rem;
  display: block;
  color: #D8000C;
  letter-spacing: 1px;
  padding: 10px;
  background-color: #FFBABA;
  border-radius: 15px;
  border: 3px solid #D8000C;
}
.modal p{
  margin: 0.2rem;
}

p.title {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
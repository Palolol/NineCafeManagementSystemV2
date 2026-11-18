<template>
<div class="date">
<div class="background-border">
<img class="arrow-back" alt="Arrow back" :src="arrowBack" />
</div>
<div class="container">
<div class="text-wrapper">▦</div>
</div>
<div class="div-wrapper">
<div class="div">08/11/2026</div>
</div>
<div class="margin">
<div class="background-border-2">
<div class="text-wrapper-2">›</div>
</div>
</div>
<div class="background-border-3">
<div class="text-wrapper-3">◷  Today</div>
</div>
</div>
</template>
<script>
import arrowBack from "./arrow-back.png";

export const Date = {
  name: "Date",
  data() {
    return {
      arrowBack,
    };
  },
};

export default Date;
</script>
<style>
.date {
  align-items: center;
  background-color: #ffffff01;
  border: 1px solid;
  border-color: #f8f8fa;
  display: flex;
  gap: 10px;
  height: 48px;
  min-width: 420px;
  padding: 4px 8px;
  position: relative;
  width: 100%;
}

.date .background-border {
  align-items: center;
  background-color: #f8f9fc;
  border: 1px solid;
  border-color: #e8e9ed;
  border-radius: 18px;
  display: flex;
  height: 36px;
  justify-content: center;
  position: relative;
  width: 36px;
}

.date .arrow-back {
  aspect-ratio: 1;
  height: 12px;
  object-fit: cover;
  position: relative;
  width: 12px;
}

.date .container {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  padding: 0px 0px 3px;
  position: relative;
}

.date .text-wrapper {
  align-items: center;
  color: #30363c;
  display: flex;
  font-family: "Lato-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  margin-top: -1px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.date .div-wrapper {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  position: relative;
}

.date .div {
  align-items: center;
  color: #30363c;
  display: flex;
  font-family: "Lato-Bold", Helvetica;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  margin-top: -1px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.date .margin {
  align-items: flex-end;
  display: flex;
  flex: 1;
  flex-direction: column;
  flex-grow: 1;
  height: 36px;
  min-width: 36px;
  padding: 0px 0px 0px 97.95px;
  position: relative;
}

.date .background-border-2 {
  align-items: center;
  background-color: #f8f9fc;
  border: 1px solid;
  border-color: #e8e9ed;
  border-radius: 18px;
  display: flex;
  height: 36px;
  justify-content: center;
  margin-left: -0.95px;
  opacity: 0.25;
  position: relative;
  width: 36px;
}

.date .text-wrapper-2 {
  align-items: center;
  color: #77818b;
  display: flex;
  font-family: "Lato-Regular", Helvetica;
  font-size: 25px;
  font-weight: 400;
  justify-content: center;
  letter-spacing: 0;
  line-height: normal;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: fit-content;
}

.date .background-border-3 {
  align-items: flex-start;
  background-color: #e7f5fd;
  border: 1px solid;
  border-color: #cee8f3;
  border-radius: 25px;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  padding: 6px 14px 7px;
  position: relative;
}

.date .text-wrapper-3 {
  align-items: center;
  color: #118fc5;
  display: flex;
  font-family: "Lato-Bold", Helvetica;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  position: relative;
  width: fit-content;
}
</style>
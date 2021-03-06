const socket = io();

function enableRepeatSchedule() {

  const items = document.getElementsByClassName("scheduleItem");
  const el = document.getElementById("repeat");

  for (let i = 0; i < items.length; i++) {
    if (el.checked) {
      items[i].disabled = false;
      items[i].style.display = "block";
    } else {
      items[i].disabled = true;
      items[i].style.display = "none";
      console.log(items);
    }
  }
}

function setMinScheduleDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  today = `${yyyy}-${mm}-${dd}`;
  document.getElementById('schedule').setAttribute('min', today);
}

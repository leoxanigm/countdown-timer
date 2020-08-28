// to do
/*

- make timer stop when user leaves browser, save current time and resume
  back timer based on the saved time
- add input buttons and a hidden optional number input field on each digit
- edit number svgs to equal heights


*/

(function() {
  const but = document.getElementById('but');

  function s(q, p = document) {
    return p.querySelector(q);
  }

  const mainContainer = s('.main-container');
  const counters = [...mainContainer.querySelectorAll('.counter')];

  const timeInput = '00:00:05';
  const directionInput = 'up';
  let startTime = 0;

  const valueTracker = {
    // Object to track previous values so we can apply flipAnimation() selectively
    hour: {
      tens: timeInput.split(':')[0][0],
      ones: timeInput.split(':')[0][1]
    },
    minute: {
      tens: timeInput.split(':')[1][0],
      ones: timeInput.split(':')[1][1]
    },
    second: {
      tens: timeInput.split(':')[2][0],
      ones: timeInput.split(':')[2][1]
    },
    setValue: function(input, key, [...args]) {
      if (this[key] !== input) {
        this[key] = input;
        this.onValueChange(...args);
      }
    },
    onValueChange: function(...args) {
      flipAnimation(...args);
    }
  };

  function getNext(input = 0, max = 9, direction = 'up') {
    const current = parseInt(input);

    if (direction === 'up') {
      switch (max) {
        case 9:
          next = current + 1 > 9 ? 0 : current + 1;
          break;
        case 5:
          next = current + 1 > 5 ? 0 : current + 1;
          break;
        case 4:
          next = current + 1 > 4 ? 0 : current + 1;
          break;
        case 2:
          next = current + 1 > 2 ? 0 : current + 1;
          break;
      }
    }
    if (direction === 'down') {
      switch (max) {
        case 9:
          next = current - 1 < 0 ? 9 : current - 1;
          break;
        case 5:
          next = current - 1 < 0 ? 5 : current - 1;
          break;
        case 4:
          next = current - 1 < 0 ? 4 : current - 1;
          break;
        case 2:
          next = current - 1 < 0 ? 2 : current - 1;
          break;
      }
    }
    return next;
  }

  function countDown(timeInput = '00:00:00', direction = 'up') {
    let currTime = timeInput.split(':');

    currTime =
      parseInt(currTime[0] * 3600) +
      parseInt(currTime[1] * 60) +
      parseInt(currTime[2]);

    let timer = setInterval(() => {
      try {
        if (direction === 'up') {
          printHandler(startTime, direction);
          ++startTime;
          if (startTime > currTime) {
            clearInterval(timer);
          }
        } else if (direction === 'down') {
          printHandler(currTime, direction);
          --currTime;
          if (currTime <= 0) {
            clearInterval(timer);
          }
        } else {
          throw 'Direction not specified';
        }
      } catch (err) {
        console.log(err);
        clearInterval(timer);
      }
    }, 1000);

    function printHandler(currTimeInput, direction = 'up') {
      let currHour = Math.floor(currTimeInput / 3600);
      let currMinute = Math.floor((currTimeInput % 3600) / 60);
      let currSecond = currTimeInput - (currHour * 3600 + currMinute * 60);

      currHour = currHour < 10 ? '0' + currHour : currHour.toString();
      currMinute = currMinute < 10 ? '0' + currMinute : currMinute.toString();
      currSecond = currSecond < 10 ? '0' + currSecond : currSecond.toString();

      const currTimeObj = {
        hour: currHour,
        minute: currMinute,
        second: currSecond
      };

      counters.forEach(counter => {
        counter.setAttribute('data-value', currTimeObj[counter.id]);

        const digits = [...counter.querySelectorAll('.digit')];

        digits.forEach((digit, i) => {
          const currValue = currTimeObj[digit.parentNode.id][i];
          const dataMax = parseInt(digit.getAttribute('data-max'));
          const nextValue = getNext(currValue, dataMax, direction);

          digit.setAttribute('data-value', currValue);
          digit.setAttribute('data-next', nextValue);

          let key = `${digit.parentNode.id}.${
            digit.classList.contains('tens') ? 'tens' : 'ones'
          }`;

          // console.log(key);

          valueTracker.setValue(currValue, key, [digit, nextValue, currValue, direction]);

          // flipAnimation(digit, nextValue, currValue, direction);
        });
      });
    }
  }

  // countDown(timeInput, directionInput);

  function flipAnimation(digit, nextValue, currValue, direction) {
    let topStartDeg = -90;
    let topFinishDeg = 0;

    let bottomStartDeg = 0;
    let bottomFinishDeg = 90;

    let cycleIncrement = 3;

    let i = setInterval(oneCycle, 2);

    function oneCycle() {
      const topFront = s('.top.front', digit);
      const topBack = s('.top.back', digit);
      const bottomFront = s('.bottom.front', digit);
      const bottomBack = s('.bottom.back', digit);

      // console.log(topFront.parentNode.parentNode.id);

      if (topStartDeg >= topFinishDeg && bottomStartDeg >= bottomFinishDeg) {
        clearInterval(i);

        digit.classList.remove('start');

        topFront.style.transform = `rotateX(-90deg)`;
        topFront.setAttribute('data-value', nextValue);

        topBack.setAttribute('data-value', currValue);

        bottomFront.style.transform = `rotateX(0deg)`;

        bottomBack.setAttribute('data-value', nextValue);
      } else if (bottomStartDeg < bottomFinishDeg) {
        bottomStartDeg += cycleIncrement;
        bottomFront.style.transform = `rotateX(${bottomStartDeg}deg)`;
      } else if (topStartDeg < topFinishDeg) {
        topStartDeg += cycleIncrement;
        topFront.style.transform = `rotateX(${topStartDeg}deg)`;

        bottomFront.setAttribute('data-value', currValue);
      }
    }
  }
})();

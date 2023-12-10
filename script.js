'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70.33, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-01-19T21:31:17.178Z',
    '2023-02-23T07:42:02.383Z',
    '2023-04-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-08-04T14:11:59.604Z',
    '2023-08-08T17:01:17.194Z',
    '2023-08-09T23:36:17.929Z',
    '2023-08-14T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500.44, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-01-18T21:31:17.178Z',
    '2023-02-23T07:42:02.383Z',
    '2023-02-28T09:15:04.904Z',
    '2023-03-01T10:17:24.185Z',
    '2023-07-04T14:11:59.604Z',
    '2023-08-08T17:01:17.194Z',
    '2023-08-09T23:36:17.929Z',
    '2023-08-10T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2023-01-25T21:31:17.178Z',
    '2023-04-23T07:42:02.383Z',
    '2023-06-28T09:15:04.904Z',
    '2023-06-01T10:17:24.185Z',
    '2023-07-04T14:11:59.604Z',
    '2023-08-10T17:01:17.194Z',
    '2023-08-11T23:36:17.929Z',
    '2023-08-13T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700.55, 50.14, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2023-01-18T21:31:17.178Z',
    '2023-02-28T09:15:04.904Z',
    '2023-03-01T10:17:24.185Z',
    '2023-07-04T14:11:59.604Z',
    '2023-08-12T10:51:36.790Z',
  ],
  currency: 'JOD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// *note* --------------- Function feild ---------------

// Create username and add it as property in object for each account
const username = function (accs) {
  accs.forEach(function (acc) {
    const arrayFirstLetter = [];
    const wordSplitLower = acc.owner.toLowerCase().split(' ');

    wordSplitLower.forEach(function (word) {
      arrayFirstLetter.push(word[0]);
    });

    acc.username = arrayFirstLetter.join('');
  });
};
username(accounts);

// Display date for movment
const displayDateMovment = function (date, locale) {
  const calcDayPased = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPased = calcDayPased(new Date(), date);
  if (daysPased === 0) return 'Today';
  if (daysPased === 1) return 'Yesterday';
  if (daysPased <= 7) return `${daysPased} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Display all movment money for account
const displayMovment = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const displaySort = acc.movements.slice().sort((n1, n2) => n1 - n2);
  const moveSort = sort ? displaySort : acc.movements;

  moveSort.forEach(function (move, index) {
    const stateMovment = move > 0 ? 'DEPOSIT' : 'WITHDRAWAL';

    // date display
    const date = new Date(currentAccount.movementsDates[index]);
    const dateFinalMovment = displayDateMovment(date, currentAccount.locale);

    const htmlMoveDisplay = `<div class="movements__row">
    <div class="movements__type movements__type--${stateMovment.toLowerCase()}">${
      index + 1
    } ${stateMovment}</div>

    <div class="movements__date">${dateFinalMovment}</div>

    <div class="movements__value">${displayFormatNumber(
      move,
      acc.locale,
      acc.currency
    )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', htmlMoveDisplay);
  });
};

// Display balance money to ui
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = displayFormatNumber(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// Display summery in money, out and interest
const displaySummary = function (acc) {
  const moneyIn = acc.movements
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0);
  labelSumIn.textContent = displayFormatNumber(
    moneyIn,
    acc.locale,
    acc.currency
  );

  const moneyOut = acc.movements
    .filter(value => value < 0)
    .reduce((acc, value) => acc + value, 0);
  labelSumOut.textContent = displayFormatNumber(
    Math.abs(moneyOut),
    acc.locale,
    acc.currency
  );

  const moneyInterest = acc.movements
    .filter(value => value > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(value => value >= 1)
    .reduce((acc, value) => acc + value, 0);
  labelSumInterest.textContent = displayFormatNumber(
    moneyInterest,
    acc.locale,
    acc.currency
  );
};

// Display time & date when login --under (current balance) lable
const DisplayTimeLogin = function (acc) {
  const now = new Date();
  labelDate.textContent = Intl.DateTimeFormat(acc.locale, {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(now);
};

// Display number as difrrent as country format
const displayFormatNumber = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display time counter, if timer done then exit account
const setTimer = function () {
  let time = 60 * 5; // 5 min

  const trck = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(loopTimer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  trck();
  const loopTimer = setInterval(trck, 1000);
  return loopTimer;
};

// Update user interface
const updateUI = function (acc) {
  displayMovment(acc);
  displayBalance(acc);
  displaySummary(acc);
};

// *note* ---------------- Btn feild / Event handlers ----------------

// login btn and show UI
let currentAccount; // This gloable variable mean: how account is active now
let timer; // This gloable variable mean: timer to close account

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  accounts.forEach(function (acc) {
    if (
      acc.username === inputLoginUsername.value &&
      acc.pin === +inputLoginPin.value
    ) {
      currentAccount = acc;
      updateUI(currentAccount);
      containerApp.style.opacity = '1';
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      DisplayTimeLogin(currentAccount);
      inputLoginPin.blur();
      inputLoginUsername.value = inputLoginPin.value = '';

      // active timer 5 min to exit account
      if (timer) clearInterval(timer); // cheack if there any timer working now
      timer = setTimer();
    }
  });
});

// transfare btn to transformation money from account to another account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const reciveAccount = accounts.find(
    value => inputTransferTo.value === value.username
  );

  const amount = +inputTransferAmount.value;

  if (
    reciveAccount &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    inputTransferTo.value !== currentAccount.username
  ) {
    reciveAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    const dateTransferMove = new Date().toISOString();
    currentAccount.movementsDates.push(dateTransferMove);
    reciveAccount.movementsDates.push(dateTransferMove);

    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    clearInterval(timer);
    timer = setTimer();
  }
});

// loan btn from bank
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    const dateTransferMove = new Date().toISOString();
    currentAccount.movementsDates.push(dateTransferMove);

    inputLoanAmount.blur();
    inputLoanAmount.value = '';
    updateUI(currentAccount);

    clearInterval(timer);
    timer = setTimer();
  }
});

// Close btn to delete account permanently forever
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const indexAccount = accounts.indexOf(currentAccount);
    accounts.splice(indexAccount, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    containerApp.style.opacity = '0';
  }
});

// Sort btn to restructure movments in pirteculare conditions
let sorted = false; // this variable mean: if sort true make sorting, if false dont make sort

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovment(currentAccount, sorted);
});

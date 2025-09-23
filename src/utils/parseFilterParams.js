// src/utils/parseFilterParams.js

const parseGender = (gender) => {
  const isString = typeof gender === 'string';
  if (!isString) return;
  const isGender = (gender) => ['male', 'female', 'other'].includes(gender);

  if (isGender(gender)) return gender;
};

const parseNumber = (number) => {
  const isString = typeof number === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return;
  }

  return parsedNumber;
};

export const parseFilterParams = (query) => {
  const { gender, maxAge, minAge, maxAvgMark, minAvgMark } = query;

  const parsedGender = parseGender(gender);
  const parsedMaxAge = parseNumber(maxAge);
  const parsedMinAge = parseNumber(minAge);
  const parsedMaxAvgMark = parseNumber(maxAvgMark);
  const parsedMinAvgMark = parseNumber(minAvgMark);

  return {
    gender: parsedGender,
    maxAge: parsedMaxAge,
    minAge: parsedMinAge,
    maxAvgMark: parsedMaxAvgMark,
    minAvgMark: parsedMinAvgMark,
  };
};

// Цей код включає функції для парсингу параметрів фільтрації, які можуть бути
// використані для обробки запитів до бази даних, особливо коли мова йде про відбір даних на основі специфічних критеріїв. Кожна функція має своє спеціалізоване призначення.
// Функція parseGender перевіряє, чи введене значення статі є рядком та чи входить воно до дозволеного списку значень (male, female, other). Якщо вхідне значення відповідає цим умовам, воно повертається; інакше функція повертає undefined, що може вказувати на відсутність чи невалідність даних.
// Функція parseNumber призначена для перевірки, чи вхідний параметр є рядком, який можна перетворити в число. Вона спробує перетворити рядок на ціле число і поверне це число, якщо перетворення успішне і результат не є NaN (не число). Якщо перетворення не вдається, повертається undefined.
// Функція parseFilterParams використовує ці дві функції для обробки різних параметрів, які можуть включати стать, вікові межі та середні оцінки (як максимальні, так і мінімальні значення). Вона приймає об'єкт query, з якого витягує ці параметри, обробляє їх через відповідні функції та збирає результати в один об'єкт, який включає оброблені та валідовані параметри. Це дозволяє забезпечити більш точний і цілеспрямований пошук в базі даних за заданими фільтрами.

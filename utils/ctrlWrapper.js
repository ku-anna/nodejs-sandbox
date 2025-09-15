// src/utils/ctrlWrapper.js

export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
//ф-ція обгортка для обробки помилок в контролерах

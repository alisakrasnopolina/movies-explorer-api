const REGEX_URL = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

const STATUS_CREATED = 201;
const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;
const STATUS_FORBIDDEN = 403;
const STATUS_NOT_FOUND = 404;
const STATUS_CONFLICT = 409;
const STATUS_INTERNAL_SERVER_ERROR = 500;
const MESSAGE_NO_DATA = 'Данные не найдены!';
const MESSAGE_WRONG_DATA = 'Некорректные данные!';
const MESSAGE_ALREADY_EXISTS = 'Пользователь с таким email уже существует. Пожалуйста, используйте другой email.';
const MESSAGE_INTERNAL_SERVER_ERROR = 'На сервере произошла ошибка!';
const MESSAGE_AUTHORISATION_REQUIRED = 'Необходима авторизация';
const MESSAGE_WRONG_LINK = 'Ссылка введена некорректно.';
const MESSAGE_EMAIL_NOT_EXISTS = 'Такого адреса электронной почты не существует.';
const MESSAGE_WRONG_EMAIL_OR_PASSWORD = 'Неправильные почта или пароль';

module.exports = {
  REGEX_URL,
  STATUS_CREATED,
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  MESSAGE_NO_DATA,
  MESSAGE_WRONG_DATA,
  MESSAGE_ALREADY_EXISTS,
  MESSAGE_INTERNAL_SERVER_ERROR,
  MESSAGE_AUTHORISATION_REQUIRED,
  MESSAGE_WRONG_LINK,
  MESSAGE_EMAIL_NOT_EXISTS,
  MESSAGE_WRONG_EMAIL_OR_PASSWORD,
};

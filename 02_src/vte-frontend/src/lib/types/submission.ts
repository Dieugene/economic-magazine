// Состояние формы подачи рукописи. Хранится в SubmissionForm как одно
// React-state-поле. Все строки — то, что пользователь ввёл (raw); файлы — File
// или null. Чекбоксы — boolean. honeypot — скрытое поле для ботов.

export interface SubmissionFormState {
  // Декларации
  declProfile: boolean;        // соответствует профилю журнала
  declOriginal: boolean;       // ранее не публиковалась
  declComplete: boolean;       // полностью укомплектована аппаратом
  declNoPlagiarism: boolean;   // нет плагиата/самоплагиата
  declAgreement: boolean;      // принимает условия договора

  // Данные автора
  authors: string;                       // ФИО (один или несколько через запятую)
  workplaceTitleAndAddress: string;      // место работы (textarea)
  positionTitle: string;                 // должность
  city: string;                          // город

  // Контакты и доп. сведения
  email: string;
  phoneNumber: string;
  degree: string;
  academicTitle: string;
  funding: string;
  orcidId: string;

  // Файлы
  docxFile: File | null;
  zipWithAdditionalFiles: File | null;

  // Согласия
  consentAgreement: boolean;   // авторское соглашение
  consentPersonalData: boolean; // обработка персональных данных

  // Honeypot — скрытое поле, человек не должен заполнять
  website: string;
}

// Ошибки валидации по тем же ключам, что и FormState. undefined / отсутствие =
// поле валидно. Используем Partial, чтобы не указывать каждый раз все ключи.
export type SubmissionErrors = Partial<Record<keyof SubmissionFormState, string>>;

export const INITIAL_FORM_STATE: SubmissionFormState = {
  declProfile: false,
  declOriginal: false,
  declComplete: false,
  declNoPlagiarism: false,
  declAgreement: false,
  authors: "",
  workplaceTitleAndAddress: "",
  positionTitle: "",
  city: "",
  email: "",
  phoneNumber: "",
  degree: "",
  academicTitle: "",
  funding: "",
  orcidId: "",
  docxFile: null,
  zipWithAdditionalFiles: null,
  consentAgreement: false,
  consentPersonalData: false,
  website: "",
};

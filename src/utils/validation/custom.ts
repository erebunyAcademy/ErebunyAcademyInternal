import { registerDecorator, ValidationOptions } from 'class-validator';

export function AtLeastOneCorrectAnswer(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneCorrectAnswer',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(answers: any[]) {
          return answers.some(answer => answer.isRightAnswer);
        },
        defaultMessage() {
          return 'At least one answer must be marked as correct';
        },
      },
    });
  };
}

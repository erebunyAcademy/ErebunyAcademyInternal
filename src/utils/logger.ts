export class Logger {
  static log(...logs: any) {
    console.log(...logs);
  }

  static time(timeStart: number, anyTextWidthParameters?: string | number, toFixed = 2) {
    Logger.c3(((Date.now() - timeStart) / 1000).toFixed(toFixed) + ' sec', anyTextWidthParameters);
  }

  static mail(emails: string[], template?: string) {
    // specified for this project for templated mails
    Logger.c1(
      `Mail ${template ? '(template -> ' + template + ') ' : ''}sent to ( ${emails.map(e => '<' + e + '> ')})`,
    );
  }

  ////////////////////////////////////////////////////////////////////////////

  private static cc(num: number | string, ...args: any) {
    console.log(`\x1b[${num}m%s`, '>>>>>> ', ...args, '\x1b[0m');
  }
  static c1(...args: any) {
    Logger.cc(94, ...args);
  }
  static c2(...args: any) {
    Logger.cc(36, ...args);
  }
  static c3(...args: any) {
    Logger.cc(95, ...args);
  }
  static c4(...args: any) {
    Logger.cc(96, ...args);
  }
  static green(...args: any) {
    Logger.cc(32, ...args);
  }
  static red(...args: any) {
    Logger.cc(31, ...args);
  }
  static grey(...args: any) {
    Logger.cc(90, ...args);
  }
  static yellow(...args: any) {
    Logger.cc(33, ...args);
  }

  static err(...args: any) {
    console.log(`\x1b[91m%s`, '<<<<<< Error: ', '\x1b[0m', ...args);
  }
  static warning(...args: any) {
    console.log(`\x1b[33m%s`, '<<<<<< Warning: ', '\x1b[0m', ...args);
  }

  static cron(...args: any) {
    console.log(`\x1b[34m%s`, '--> Cron --> ', new Date().toISOString(), '->', '\x1b[0m', ...args);
  }
}

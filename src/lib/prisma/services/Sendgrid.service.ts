import sgMail from '@sendgrid/mail';

enum TemplateIdsEnum {
  emailVerificationTemplateId = 'd-e11d343ac0ee4ba3bfbe3f4e4f1d0e82',
  forgotPasswordTemplateId = 'd-a3cf5ceaaaa8440abb7ddb87921a44db',
  confirmUserTemplateId = 'd-2ac38a68473d469dad668fe4198b5625',
  rejectUserTemplateId = 'd-6d17460282fe4d4fb78b692c1a658e69',
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

class Email {
  static formatEmails(emails: string[]): { email: string }[] {
    return emails?.map(email => ({ email }));
  }

  async sendConfirmationCodeEmail(
    email: string,
    confirmationCode: number,
    firstName: string,
  ): Promise<any> {
    return this.sendEmail(email, {
      template_id: TemplateIdsEnum.emailVerificationTemplateId,
      personalizations: [
        {
          to: email,
          dynamic_template_data: {
            firstName,
            link: `${process.env.NEXTAUTH_URL}/am/signin?code=${confirmationCode}`,
          },
        },
      ],
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    confirmationCode: number,
    firstName: string,
  ): Promise<any> {
    return this.sendEmail(email, {
      template_id: TemplateIdsEnum.forgotPasswordTemplateId,
      personalizations: [
        {
          to: email,
          dynamic_template_data: {
            confirmationCode,
            firstName,
          },
        },
      ],
    });
  }

  async approveUserAccountEmail(email: string, firstName: string): Promise<any> {
    return this.sendEmail(email, {
      template_id: TemplateIdsEnum.confirmUserTemplateId,
      personalizations: [
        {
          to: email,
          dynamic_template_data: {
            firstName,
            link: `${process.env.NEXT_PUBLIC_BASE_URL}/am/signin`,
          },
        },
      ],
    });
  }

  async rejectUserAccountEmail(email: string, firstName: string, message: string): Promise<any> {
    return this.sendEmail(email, {
      template_id: TemplateIdsEnum.rejectUserTemplateId,
      personalizations: [
        {
          to: email,
          dynamic_template_data: {
            firstName,
            message,
          },
        },
      ],
    });
  }

  async sendEmail(
    to: string,
    data: any = {},
    from: string = `erebuniacademyfoundation@gmail.com`,
  ): Promise<any> {
    try {
      const message = {
        to,
        from,
        ...data,
      };
      return sgMail.send(message);
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}

const instance = new Email();

export { instance as Email };

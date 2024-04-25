import sgMail from '@sendgrid/mail';

enum TemplateIdsEnum {
  emailVerificationTemplateId = 'd-cf8f50b184474cb1a17f0b652177eb55',
  forgotPasswordTemplateId = 'd-85df99defaf5421aa6d623d85f858df4',
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

class Email {
  static formatEmails(emails: string[]): { email: string }[] {
    return emails?.map(email => ({ email }));
  }

  async sendConfirmationCodeEmail(
    email: string,
    confirmationCode: number,
    userFirstName: string,
  ): Promise<any> {
    return this.sendEmail(email, {
      template_id: TemplateIdsEnum.emailVerificationTemplateId,
      personalizations: [
        {
          to: email,
          dynamic_template_data: {
            userFirstName,
            link: `${process.env.NEXTAUTH_URL}/successfully-signed-up/${confirmationCode}`,
          },
        },
      ],
    });
  }

  async sendForgotPasswordEmail(email: string, confirmationCode: number): Promise<any> {
    return this.sendEmail(email, {
      template_id: TemplateIdsEnum.forgotPasswordTemplateId,
      personalizations: [
        {
          to: email,
          dynamic_template_data: {
            confirmationCode,
          },
        },
      ],
    });
  }

  async sendEmail(to: string, data: any = {}, from: string = `account@pba.am`): Promise<any> {
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

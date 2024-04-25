import twilio, { Twilio } from 'twilio';

export class TwilioService {
  twilio: Twilio;
  constructor() {
    this.twilio = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN);
  }

  sendVerificationSMS(to: string, confirmationCode: number) {
    return this.twilio.messages
      .create({
        from: '+13192545874',
        to: `+${to}`,
        body: `Your verification code is ${confirmationCode}`,
      })
      .then(() => console.log({ TwilioService: 'SUCCESS' }))
      .catch(error => console.log({ TwilioService: error }));
  }
}

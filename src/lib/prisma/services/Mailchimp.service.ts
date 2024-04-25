import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: 'us5',
});

export class Mailchimp {
  static async sendDataToMailchimp(data: any) {
    const merge_fields: any = {
      FNAME: data.firstName,
      LNAME: data.lastName,
    };

    const subscriber = {
      email_address: data.email,
      status: 'subscribed', // 'subscribed' for immediate addition, 'pending' for double opt-in
      merge_fields: merge_fields,
    };

    try {
      // Use addListMember to add the subscriber to the specified list
      const response = await mailchimp.lists.addListMember('d9d1a63123', subscriber, {
        skipMergeValidation: false,
      });
      console.log({ response });
      return response;
    } catch (error) {
      console.error('Error sending data to Mailchimp:');
      throw error; // Rethrow to handle upstream if necessary
    }
  }
}

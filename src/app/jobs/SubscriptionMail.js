import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { subscription } = data;

    await Mail.sendEmail({
      to: `${subscription.user.name} <${subscription.user.email}>`,
      subject: 'Inscrição em Meetup',
      template: 'subscription',
      context: {
        owner: subscription.meetup.user.name,
        user: subscription.user.name,
        meetup: subscription.meetup.title,
        date: format(
          parseISO(subscription.meetup.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new SubscriptionMail();

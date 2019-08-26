import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  async store(req, res) {
    const result = await Subscription.create({
      meetup_id: req.body.meetupId,
      user_id: req.userId,
    });

    const subscription = await Subscription.findOne({
      where: {
        id: result.id,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['title', 'date'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(SubscriptionMail.key, {
      subscription,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();

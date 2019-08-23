import { isEqual, isAfter } from 'date-fns';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionValidation {
  async userIsGuestValidation(req, res, next) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.body.meetupId,
        user_id: req.userId,
      },
    });

    if (meetup) {
      return res
        .status(401)
        .json({ error: 'You can not subscribe on your own meetup.' });
    }

    return next();
  }

  async pastDateValidation(req, res, next) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.body.meetupId,
      },
    });

    if (meetup && isAfter(new Date(), meetup.date)) {
      return res
        .status(401)
        .json({ error: 'You can not subscribe on a past meetup.' });
    }

    return next();
  }

  async twiceSubscriptionValidation(req, res, next) {
    const subscription = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: req.body.meetupId,
      },
    });

    if (subscription) {
      return res
        .status(401)
        .json({ error: 'You can not subscribe at the same meetup twice.' });
    }

    return next();
  }

  async sameTimeValidation(req, res, next) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['date'],
        },
      ],
    });

    const meetup = await Meetup.findOne({
      where: {
        id: req.body.meetupId,
      },
    });

    const conflicts = subscriptions.filter(subscription =>
      isEqual(subscription.meetup.date, meetup.date)
    );

    if (conflicts.length > 0) {
      return res.status(401).json({
        error:
          'You can not subscribe at two or more meetups happening at the same time.',
      });
    }

    return next();
  }
}

export default new SubscriptionValidation();

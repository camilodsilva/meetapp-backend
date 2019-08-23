import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const subscription = await Subscription.create({
      meetup_id: req.body.meetupId,
      user_id: req.userId,
    });
    return res.json(subscription);
  }
}

export default new SubscriptionController();

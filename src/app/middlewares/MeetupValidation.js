import { isBefore, isAfter, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupValidation {
  async pastDateValidation(req, res, next) {
    const { date } = req.body;
    const parsedDate = parseISO(date);

    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({
        error:
          'You are not allowed to create or edit a meetup with a past date.',
      });
    }

    return next();
  }

  async meetupOwnerValidation(req, res, next) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    /**
     * if the return is null returns with error
     */
    if (!meetup) {
      return res.status(401).json({
        error: 'You are not allowed to edit this meetup.',
      });
    }

    /**
     * check if the meetup not happened. only future meetups can be edited.
     */
    if (!isAfter(meetup.date, new Date())) {
      return res.status(401).json({
        error:
          'You are not allowed to edit this meetup. Only future meetups can be edited or cancelled.',
      });
    }

    return next();
  }
}

export default new MeetupValidation();

import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';

import Banner from '../models/Banner';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;
    const searchDate = new Date(date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      attributes: ['title', 'description', 'location', 'date'],
      limit: 10,
      offset: (page - 1) * 10,
      order: ['date'],
      include: [
        {
          model: Banner,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const { title, description, location, date, bannerId } = req.body;

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id: req.userId,
      banner_id: bannerId,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    const { title, description, location, date } = await meetup.update(
      req.body
    );

    return res.json({
      title,
      description,
      location,
      date,
    });
  }

  async delete(req, res) {
    await Meetup.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: 'The meetup has been delete successfully.' });
  }
}

export default new MeetupController();

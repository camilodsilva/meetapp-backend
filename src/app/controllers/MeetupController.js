import Meetup from '../models/Meetup';
import Banner from '../models/Banner';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['title', 'description', 'location', 'date'],
      order: ['date'],
      include: [
        {
          model: Banner,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
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
    const meetup = await Meetup.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: 'The meetup has been delete successfully.' });
  }
}

export default new MeetupController();

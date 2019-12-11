import Company from './Pages/Company';
import Meetups from './Pages/Meetups';
import Meetup from './Pages/Meetup';

import Events from './Pages/Events';
import Participants from './Pages/Participants';
import Works from './Pages/Works';
import Nominees from './Pages/Nominees';
import Media from './Pages/Media';
import Information from './Pages/Information';

import Login from './Pages/Login';
import Logout from './Pages/Logout';

/**
 * This object is a wrapper for all allowed page components in application.
 * If you're create new page component, you're SHOULD add it to this object.
 */
const Page = {
    Company:    Company,
    Meetups:    Meetups,
    Meetup:     Meetup,

    Events:       Events,
    Participants: Participants,
    Works:        Works,
    Nominees:        Nominees,
    Media:        Media,
    Information:        Information,

    Login:      Login,
    Logout:     Logout,
};

export default Page;
import React from 'react';

import Actions from './Cells/Actions';
import Check from './Cells/Check';
import Date from './Cells/Date';
import Image from './Cells/Image';
import WorksAuthors from './Cells/WorksAuthors';
import NomineesAuthors from './Cells/NomineesAuthors';
import Curator from './Cells/Curator';
import EventType from './Cells/EventType';
import MeetupType from './Cells/MeetupType';
import ParticipantsType from './Cells/ParticipantsType';
import Description from './Cells/Description';
import UnwrappedDescription from './Cells/UnwrappedDescription';

import Corner from './Cells/Corner';
import Rounded from './Cells/Rounded';
import ParticipantColor from './Cells/ParticipantColor';

import Common from './Cells/Common';

/**
 * Wrapper for all components which represent different types of table cells
 */
const Cells = {
    Actions: Actions,
    Check: Check,
    Date: Date,
    Image: Image,
    WorksAuthors: WorksAuthors,
    NomineesAuthors: NomineesAuthors,
    Curator: Curator,
    EventType: EventType,
    MeetupType: MeetupType,
    ParticipantsType: ParticipantsType,
    ParticipantColor: ParticipantColor,
    Description: Description,
    Unwrappeddescription: UnwrappedDescription,

    Corner: Corner,
    Rounded: Rounded,

    Common: Common,
 };

export default Cells;
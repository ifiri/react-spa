import Cancel from './ActionButtons/Cancel';
import Create from './ActionButtons/Create';
import CreateStandard from './ActionButtons/CreateStandard';
import ManageDepartment from './ActionButtons/ManageDepartment';
import ManageMeetupSection from './ActionButtons/ManageMeetupSection';
import ManageEvent from './ActionButtons/ManageEvent';
import ManageParticipant from './ActionButtons/ManageParticipant';
import ManageWork from './ActionButtons/ManageWork';
import ManageNomination from './ActionButtons/ManageNomination';
import ManageNominee from './ActionButtons/ManageNominee';
import CropLogo from './ActionButtons/CropLogo';
import Delete from './ActionButtons/Delete';
import DeleteMediaEntry from './ActionButtons/DeleteMediaEntry';
import OK from './ActionButtons/OK';
import Confirm from './ActionButtons/Confirm';

import AddMedia from './ActionButtons/AddMedia';
import ManageVideo from './ActionButtons/ManageVideo';
import ViewMedia from './ActionButtons/ViewMedia';

/**
 * This object represent a bunch of buttons, which
 * can doing something. Some buttons can be connect to state,
 * in other words, action can be difficult.
 *
 * One action - one button.
 * 
 * @type Object
 */
const ActionButtons = {
    ManageDepartment: ManageDepartment,
    ManageMeetupSection: ManageMeetupSection,
    ManageEvent: ManageEvent,
    ManageParticipant: ManageParticipant,
    ManageWork: ManageWork,
    ManageNomination: ManageNomination,
    ManageNominee: ManageNominee,
    Cancel: Cancel,
    Confirm: Confirm,

    Create: Create,
    CreateStandard: CreateStandard,
    Delete: Delete,
    DeleteMediaEntry: DeleteMediaEntry,
    
    CropLogo: CropLogo,
    OK: OK,
    
    AddMedia: AddMedia,
    ManageVideo: ManageVideo,
    ViewMedia: ViewMedia,
};

export default ActionButtons;
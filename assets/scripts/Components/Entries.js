import EntriesTable from './Entries/Table/Table';
import EntriesHead from './Entries/Table/Sections/Head';
import EntriesBody from './Entries/Table/Sections/Body';
import EntriesRow from './Entries/Table/Row';
import EntriesCells from './Entries/Table/Cells';

import EntriesList from './Entries/List';
import EntriesPhotosGrid from './Entries/PhotosGrid';
import EntriesVideosGrid from './Entries/VideosGrid';

/**
 * This object is a wrapper for all entries-related components.
 * It is a Entries table elements, and the main component of 
 * Entries ecosystem - List.
 * 
 * @type Object
 */
const Entries = {
    Table: EntriesTable,
    Head: EntriesHead,
    Body: EntriesBody,
    Row:  EntriesRow,
    Cells: EntriesCells,

    List: EntriesList,
    PhotosGrid: EntriesPhotosGrid,
    VideosGrid: EntriesVideosGrid,
 };

export default Entries;
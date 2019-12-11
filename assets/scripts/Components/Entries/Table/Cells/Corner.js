import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

import Common from './Common';

/**
 * Cell with some action buttons
 */
export default class Corner extends Common {
    isCellContentShouldBeWrapped() {
        return false;
    }

    getHeadingCellValue() {
        return null;
    }

    getCommonCellValue() {
        return <SvgIcon className="icon icon__corner" component={svgProps => (
            <svg {...svgProps}>
                <use xlinkHref="#corner" />
            </svg>
            )}
        />;
    }
}
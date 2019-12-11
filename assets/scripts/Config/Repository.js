import CONFIG from '../config.js';

/**
 * Repository class for all config directives
 */
export default class ConfigRepository {
    /**
     * Entry point for getting param from config.
     * Path to param looks like 'path.to.param'
     * 
     * @param  param String
     * @return String | Array | Object | null
     */
    static get(param) {
        let parsedPath = param.split('.');

        return ConfigRepository.extractParam(parsedPath);
    }

    /**
     * Get param from config tree by parsed path to param
     * 
     * @param  parsedPath Array
     * @return String | Array | Object | null
     */
    static extractParam(parsedPath) {
        let result = null;

        let currentStack = CONFIG;
        const pathLength = parsedPath.length;

        for (let depth = 0; depth <= pathLength; depth++) {
            if(ConfigRepository.isCurrentParamExistInConfig(currentStack, parsedPath, depth)) {
                
                currentStack = currentStack[parsedPath[depth]];
                continue;
            
            } else if(ConfigRepository.isDeepestDepthInPath(pathLength, depth)) {
                result = currentStack;
            }

            break;
        }

        return result;
    }

    /**
     * If current depth is deepest
     * 
     * @param  pathLength Integer
     * @param  depth Integer
     * @return Boolean
     */
    static isDeepestDepthInPath(pathLength, depth) {
        return depth === pathLength;
    }

    /**
     * If current param exists in config, return true
     * 
     * @param  stack Array
     * @param  parsedParam Array
     * @param  depth Integer
     * @return Boolean
     */
    static isCurrentParamExistInConfig(stack, parsedParam, depth) {
        if(typeof stack === 'object' || stack.length) {
            return parsedParam[depth] && stack[parsedParam[depth]];
        }

        return false;
    }
}
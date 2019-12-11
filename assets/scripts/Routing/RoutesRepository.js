import ConfigRepository from '../Config/Repository';

/**
 * Repository for routes. Provides interface for
 * getting routes by access level and route index by route.
 */
export default class RoutesRepository {
    /**
     * Returns route map by access level
     * 
     * @param  accessLevel String
     * @return Array
     */
    static getRoutesBy(accessLevel) {
        const routes = ConfigRepository.get('routes.' + accessLevel) || [];

        return routes;
    }

    /**
     * Returns first route for passed access level.
     * If no routes found, return root path
     * 
     * @param  accessLevel String
     * @return String
     */
    static getBaseRoutePathBy(accessLevel) {
        const routes = ConfigRepository.get('routes.' + accessLevel);

        if(routes) {
            const firstRoutePath = Object.keys(routes)[0];

            return firstRoutePath;
        }

        return '/';
    }

    /**
     * Return index of passed route
     * 
     * @param  route Object
     * @param  routes Object
     * @return Integer | null
     */
    static getRouteIndex(route, routes = {}) {
        if(route && routes && route.path in routes) {
            if(routes[route.path].order) {
                return routes[route.path].order - 1;
            }

            return Object.keys(routes).indexOf(route.path) + 100;
        }

        return null;
    }

    static getMatchFromMatches(location, routes = {}) {
        const matches = RoutesRepository.getMatches(location, routes);

        for(const index in matches) {
            const currentMatch = matches[index];
        }

        return match;
    }

    static getMatch(location, routes = {}) {
        let match = [];

        for(const route in routes) {
            const routeParams = routes[route];

            match = RoutesRepository.getMatchByLocation(location, routes);

            if(!match && routeParams.routes) {
                match = RoutesRepository.getMatchByLocation(location, routeParams.routes, 1)
            }
        }

        // console.log(' :: MATCHES ::');
        // console.log(match);
        return match;
    }

    static getMatchByLocation(location, routes = {}, depth = 0) {
        let match = null;

        const matches = [];
        for(const route in routes) {
            let matchCount = 0;
            const routeParams = routes[route];
            const params = [];

            const routeParts = route.replace(/^\//g, '').split('/');
            const locationParts = location.pathname.replace(/^\//g, '').split('/');

            if(routeParts.length !== locationParts.length) {
                continue;
            }

            for(const index in routeParts) {
                const currentRoutePart = routeParts[index];
                const currentLocationPart = locationParts[index];

                if(currentRoutePart === currentLocationPart) {
                    matchCount++;

                    continue;
                }

                // Param is here
                if(currentRoutePart.match(/^:/g)) {
                    const paramName = currentRoutePart.replace(/^:/g, '');

                    params[paramName] = currentLocationPart;
                    matchCount++;

                    continue;
                }
            }

            if(matchCount === routeParts.length) {
                match = {
                    path: route,
                    location: location.pathname,
                    count: matchCount,
                    routes: routeParams.routes || null,
                    bunch: routes,
                    params: params,
                    depth: depth,
                };

                break;
            }
        }

        return match;
    }
}
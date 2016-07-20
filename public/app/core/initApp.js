import {completeDatePrototype} from '../api/dateApi'
import {DATA_DATE,FILTER_DATE} from '../api/definition'

export default function() {
    completeDatePrototype();
    completeConfig();
}

function completeConfig() {
    RAW_DATA_COL.EVENTS.forEach(function (element) {
        element.dataType = DATA_DATE;
        element.filterType = FILTER_DATE
    });
}

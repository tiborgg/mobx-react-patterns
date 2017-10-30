'use strict';

const KIBI_R = 1024;
const MEBI_R = KIBI_R * 1024;
const GIBI_R = MEBI_R * 1024;

export default function getDisplaySize(bytes) {

    let prefix;
    let value;

    if (bytes < KIBI_R) {
        prefix = '';
        value = bytes;
    }
    else if (bytes < MEBI_R) {
        prefix = 'Ki';
        value = bytes / KIBI_R;
    }
    else if (bytes < GIBI_R) {
        prefix = 'Mi';
        value = bytes / MEBI_R;
    }
    else {
        prefix = 'Gi';
        value = bytes / GIBI_R;
    }

    return value.toFixed(2) + ' ' + prefix + 'B';
}
export default function checkTimeRangeOverlap(range1, range2) {
    return range1.from <= range2.to && range1.to >= range2.from;
}
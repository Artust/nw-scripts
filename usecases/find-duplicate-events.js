/**
 * Find event duplicate by rule that same subject, start, end, creator
 * @param {Array} events list event
 * @returns list event duplicate
 */
const findDuplicates = (events) => {
  const duplicateEvents = [];
  events.forEach((event, index) => {
    if (duplicateEvents.findIndex((ele) => ele.eventId === event.eventId) !== -1) {
      return;
    }
    const same = events
      .slice(index + 1)
      .filter(
        (ele) =>
          ele.garoonId === event.garoonId &&
          ele.subject === event.subject &&
          ele.garoon_start_dateTime === event.garoon_start_dateTime &&
          ele.garoon_end_dateTime === event.garoon_end_dateTime
      );
    duplicateEvents.push(...same);
  });
  return duplicateEvents;
};

exports.findDuplicates = findDuplicates;

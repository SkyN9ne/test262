// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime.prototype.with
description: TypeError thrown if timeZone.getOffsetNanosecondsFor is not callable
features: [BigInt, Symbol, Temporal, arrow-function]
---*/

[undefined, null, true, Math.PI, 'string', Symbol('sym'), 42n, {}].forEach((notCallable) => {
  const timeZone = new Temporal.TimeZone("UTC");
  const datetime = new Temporal.ZonedDateTime(1_000_000_000_987_654_321n, timeZone);
  timeZone.getOffsetNanosecondsFor = notCallable;
  assert.throws(
    TypeError,
    () => datetime.with({ day: 27 }, { offset: "prefer" }),
    `Uncallable ${typeof notCallable} ${notCallable} getOffsetNanosecondsFor should throw TypeError (in offset=prefer and no disambiguation case)`
  );

  const badTimeZone = {
    getPossibleInstantsFor() { return []; },
    getOffsetNanosecondsFor: notCallable,
  };
  const badDateTime = new Temporal.ZonedDateTime(1_000_000_000_987_654_321n, badTimeZone);
  assert.throws(
    TypeError,
    () => badDateTime.with({ day: 27 }, { offset: "ignore" }),
    `Uncallable ${typeof notCallable} ${notCallable} getOffsetNanosecondsFor should throw TypeError (in offset=ignore and no possible instants case)`
  );
  assert.throws(
    TypeError,
    () => badDateTime.with({ day: 27 }, { offset: "prefer" }),
    `Uncallable ${typeof notCallable} ${notCallable} getOffsetNanosecondsFor should throw TypeError (in offset=prefer and no possible instants case)`
  );
});

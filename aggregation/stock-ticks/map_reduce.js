// Candle stick graph
m = function() {
    new_date = new Date(this.ts);
    // Turn the ts into a minute bucket
    minute = new Date(new_date.setSeconds(0))
    emit(minute, this);
}

r = function(key, values) {
  var bid = {
    low: Number.MAX_VALUE,
    high: Number.MIN_VALUE,
    count: 0,
    total: 0,
    open: 0,
    open_ts: 0,
    close: 0,
    close_ts: 0,
  }

  var ask = {
    low: Number.MAX_VALUE,
    high: Number.MIN_VALUE,
    count: 0,
    total: 0,
    open: 0,
    open_ts: 0,
    close: 0,
    close_ts: 0,
  }

  values.forEach(function(v) {
    var b = v['bid'];
    var a = v['ask'];
    var ts = v['ts'];

    // first - find opening bid in the range
    if (bid.open_ts == 0) {
      bid.open_ts = ts;
      bid.open = b;
    } else if ( ts < bid.open_ts ) {
      bid.open_ts = ts;
      bid.open = b;
    }

    // last - final closing bid in the range
    if (bid.close_ts == 0) {
      bid.close_ts = ts;
      bid.close = b;
    } else if ( ts > bid.close_ts ) {
      bid.close_ts = ts;
      bid.close = b;
    }

    // max - find max bid for the range
    if (b > bid.high) {
      bid.high = b;
    }

    // min - find min bid for the range
    if (b < bid.low) {
      bid.low = b;
    }

    // count - count the number of entries for the range
    bid.count += 1;

    // sum - sum the bid for the range
    bid.total += b;

    // first - find opening bid in the range
    if (ask.open_ts == 0) {
      ask.open_ts = ts;
      ask.open = a;
    } else if ( ts < ask.open_ts ) {
      ask.open_ts = ts;
      ask.open = a;
    }

    // last - final closing bid in the range
    if (ask.close_ts == 0) {
      ask.close_ts = ts;
      ask.close = a;
    } else if ( ts > ask.close_ts ) {
      ask.close_ts = ts;
      ask.close = a;
    }

    // max - find max bid for the range
    if (a > ask.high) {
      ask.high = a;
    }

    // min - find min bid for the range
    if (a < ask.low) {
      ask.low = a;
    }

    // count - count the number of entries for the range
    ask.count += 1;

    // sum - sum the bid for the range
    ask.total += a;
  });

  return { minute: key,
           bid: bid,
           ask: ask};
}

f = function(key,  obj) {
  // average - calc the average for the range
  if (obj.bid.count > 0){
      obj.bid.avg = obj.bid.total / obj.bid.count;
  }

  // average - calc the average for the range
  if (obj.ask.count > 0){
      obj.ask.avg = obj.ask.total / obj.ask.count;
  }

  delete obj.bid.count;
  delete obj.bid.open_ts;
  delete obj.bid.close_ts;
  delete obj.bid.total;
  delete obj.ask.count;
  delete obj.ask.open_ts;
  delete obj.ask.close_ts;
  delete obj.ask.total;
  delete obj.minute;

  return obj;
}

// Run the Map/Reduce
db.money.mapReduce(m, r, {out : {inline: 1}, finalize : f});

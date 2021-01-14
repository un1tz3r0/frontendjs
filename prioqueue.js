
/* ---------------------------------------------------------------------
PrioQueue - priority sorted random access collection, e.g. for queuing rendering
tasks which must be done in specific order due to layer compositing
* ---------------------------------------------------------------------- */

class PrioQueue {
  constructor() {
    this.prios = new Map();
  }
  get(prio) {
    if(!this.prios.has(prio)) {
      this.prios.set(prio, new Array()); }
    return this.prios.get(prio);
  }
  insertlast(prio, value) {
    this.get(prio).push(value);
  }
  insertfirst(prio, value) {
    this.get(prio).unshift(value);
  }
  remove(prio=null, value=null) {
    if(prio==null && value==null) {
      this.prios.clear();
    }
    else if(value==null && prio!=null) {
      if(this.prios.has(prio))
        this.prios.delete(prio);
    }
    else if(value!=null && prio==null) {
      this.prios.elems().each((prio, vals)=>{
        vals.remove(value);
        if(vals.length <= 0) {
          this.prios.delete(prio);
        }
      });
    } else {
      if(this.prios.has(prio))
      {
        this.prios.get(prio).delete(value);
      }
    }
  }
  minprio() {
    return Array.from(this.prios.keys()).sort((l,r) => l>r?1:l<r?-1:0 )[0];
  }
  maxprio() {
    return Array.from(this.prios.keys()).sort((l,r) => l>r?-1:l<r?1:0 )[0];
  }
  length() {
    var total = 0;
    Array.from(this.prios.values()).each((vals)=>{total=total+vals.length})
    return total;
  }
  pop() {
    if(this.prios.size <= 0)
      return [null, null];
    var prio = this.maxprio();
    var vals = this.prios.get(prio);
    var val = vals.pop();
    if(vals.length <= 0)
      this.prios.delete(prio);
    return [prio, val];
  }
  shift() {
    if(this.prios.size <= 0)
      return [null, null];
    var prio = this.minprio();
    var vals = this.prios.get(prio);
    var val = vals.shift();
    if(vals.length <= 0)
      this.prios.delete(prio);
    return [prio, val];
  }
}


